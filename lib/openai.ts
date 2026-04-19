import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

export const isOpenAIConfigured = Boolean(apiKey);

export const openai = apiKey
  ? new OpenAI({ apiKey })
  : null;

export const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-5";