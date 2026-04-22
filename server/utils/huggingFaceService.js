import axios from "axios";

const DEFAULT_MODEL = process.env.HF_BERT_MODEL || "dslim/bert-base-NER";
const HF_API_BASE_URL =
    process.env.HF_API_BASE_URL ||
    "https://router.huggingface.co/hf-inference/models";

const getHuggingFaceToken = () =>
    process.env.HF_API_KEY ||
    process.env.HF_TOKEN ||
    process.env.HUGGINGFACE_API_TOKEN ||
    process.env.HUGGING_FACE_TOKEN ||
    process.env.HUGGINGFACE_TOKEN;

const splitTextIntoChunks = (text, maxChunkLength = 1200) => {
    const normalized = String(text || "").replace(/\s+/g, " ").trim();
    if (!normalized) {
        return [];
    }

    const sentences = normalized.split(/(?<=[.!?])\s+/);
    const chunks = [];
    let currentChunk = "";

    for (const sentence of sentences) {
        if (!sentence) {
            continue;
        }

        if (sentence.length > maxChunkLength) {
            if (currentChunk) {
                chunks.push(currentChunk.trim());
                currentChunk = "";
            }

            for (let index = 0; index < sentence.length; index += maxChunkLength) {
                chunks.push(sentence.slice(index, index + maxChunkLength).trim());
            }
            continue;
        }

        const candidate = currentChunk ? `${currentChunk} ${sentence}` : sentence;
        if (candidate.length > maxChunkLength) {
            chunks.push(currentChunk.trim());
            currentChunk = sentence;
        } else {
            currentChunk = candidate;
        }
    }

    if (currentChunk) {
        chunks.push(currentChunk.trim());
    }

    return chunks;
};

const dedupeEntities = (entities) => {
    const seen = new Set();

    return entities.filter((entity) => {
        const key = `${entity.label}:${entity.text.toLowerCase()}`;
        if (seen.has(key)) {
            return false;
        }

        seen.add(key);
        return true;
    });
};

const groupEntities = (entities, label) =>
    entities
        .filter((entity) => entity.label === label)
        .map((entity) => entity.text);

export const extractResumeEntitiesWithBert = async (resumeText) => {
    const token = getHuggingFaceToken();

    if (!token) {
        throw new Error(
            "HF_TOKEN (or HUGGINGFACE_API_TOKEN) is not configured in server/.env"
        );
    }

    const chunks = splitTextIntoChunks(resumeText).slice(0, 8);
    if (!chunks.length) {
        return {
            model: DEFAULT_MODEL,
            entities: [],
            persons: [],
            organizations: [],
            locations: [],
            miscellaneous: [],
        };
    }

    const responses = [];

    for (const chunk of chunks) {
        let data;

        try {
            const response = await axios.post(
                `${HF_API_BASE_URL}/${DEFAULT_MODEL}`,
                {
                    inputs: chunk,
                    parameters: {
                        aggregation_strategy: "simple",
                        ignore_labels: ["O"],
                    },
                    options: {
                        wait_for_model: true,
                    },
                },
                {
                    timeout: 30000,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            data = response.data;
        } catch (error) {
            const details =
                error?.response?.data?.error ||
                error?.response?.data?.message ||
                JSON.stringify(error?.response?.data || {}) ||
                error.message;

            throw new Error(`Hugging Face BERT extraction failed: ${details}`);
        }

        if (Array.isArray(data)) {
            responses.push(...data);
        }
    }

    const entities = dedupeEntities(
        responses
            .map((item) => ({
                text: String(
                    item.word || item.text || item.entity || item.entity_group || ""
                )
                    .replace(/\s+/g, " ")
                    .replace(/##/g, "")
                    .trim(),
                label: String(item.entity_group || item.entity || "").replace(/^B-|^I-/, ""),
                score: Number(item.score || 0),
            }))
            .filter((item) => item.text && item.label)
    );

    return {
        model: DEFAULT_MODEL,
        entities,
        persons: groupEntities(entities, "PER"),
        organizations: groupEntities(entities, "ORG"),
        locations: groupEntities(entities, "LOC"),
        miscellaneous: groupEntities(entities, "MISC"),
    };
};
