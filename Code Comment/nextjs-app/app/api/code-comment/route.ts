import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

async function callOllamaLlama3(prompt: string): Promise<string> {
  // Call Ollama API locally (assuming Ollama is running on localhost:11434)
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
  model: 'llama3:latest',
      prompt,
      stream: false,
    }),
  });
  const data = await response.json();
  return data.response || '';
}

export async function POST(req: NextRequest) {
  const { code, language } = await req.json();
  if (!code || !language) {
    return new Response(JSON.stringify({ error: 'Missing code or language.' }), { status: 400 });
  }
  // Updated prompt: block comments give an overview of each code block, single-line comments are short
  const prompt = `Add comments to the following ${language} code:
Write a block comment above the [class/function/module] that briefly explains what it does, its purpose, and its key inputs/outputs or features. Use the standard comment style for the given programming language.
For each logical block or section, add a brief block comment above it that gives an overview of what the block does.
For individual lines or statements, add short single-line comments that are direct and easy to scan.
Return only one code block with both comment styles integrated. Do not separate or label them.

Code:
${code}`;
  try {
    const commentedCode = await callOllamaLlama3(prompt);
    return new Response(JSON.stringify({ commentedCode }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to generate comments.' }), { status: 500 });
  }
}
