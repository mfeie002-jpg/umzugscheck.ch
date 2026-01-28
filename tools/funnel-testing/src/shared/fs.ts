import { promises as fs } from 'fs';
import { dirname } from 'path';

export async function ensureDir(path: string) {
  try {
    await fs.mkdir(path, { recursive: true });
  } catch (error) {
    // Ignore if directory already exists
  }
}

export async function readJSON<T>(path: string): Promise<T> {
  const content = await fs.readFile(path, 'utf-8');
  return JSON.parse(content);
}

export async function writeJSON<T>(path: string, data: T, pretty = true) {
  await ensureDir(dirname(path));
  const content = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
  await fs.writeFile(path, content, 'utf-8');
}

export async function fileExists(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

export async function listDir(path: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(path);
    return entries;
  } catch {
    return [];
  }
}

export async function glob(pattern: string, baseDir = '.'): Promise<string[]> {
  // Simple glob implementation for basic patterns
  const entries = await listDir(baseDir);
  if (pattern === '*') {
    return entries;
  }
  // For more complex patterns, would need glob library
  return entries.filter((e) => e.includes(pattern));
}
