// Prints the slugs of posts scheduled for today (UTC), one per line.
// The publish workflow rebuilds the site when there are any.
import { readdirSync, readFileSync } from 'node:fs'

const DIR = new URL('../content/blog/', import.meta.url)
const today = new Date().toISOString().slice(0, 10)

for (const name of readdirSync(DIR).filter(file => file.endsWith('.md'))) {
  const frontmatter = readFileSync(new URL(name, DIR), 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ''
  const date = frontmatter.match(/^date:\s*['"]?(\d{4}-\d{2}-\d{2})/m)?.[1]
  const draft = /^draft:\s*true\s*$/m.test(frontmatter)
  if (date === today && !draft) console.log(name.replace(/\.md$/, ''))
}
