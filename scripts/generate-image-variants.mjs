// Writes smaller WebP copies next to each gallery image and records them in
// app/data/image-variants.json. Run after adding images: npm run images
import { readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'

const DIRECTORIES = ['case-studies', 'personal-projects']
const WIDTHS = [480, 960, 1440]
const VARIANT = /-\d+w\.webp$/

const manifest = {}

for (const directory of DIRECTORIES) {
  const files = await readdir(join('public', directory))

  for (const file of files.filter(name => name.endsWith('.webp') && !VARIANT.test(name)).sort()) {
    const source = join('public', directory, file)
    const { width } = await sharp(source).metadata()
    const variants = WIDTHS.filter(target => target < width)

    for (const target of variants) {
      await sharp(source)
        .resize({ width: target })
        .webp({ quality: 82 })
        .toFile(source.replace(/\.webp$/, `-${target}w.webp`))
    }

    manifest[`/${directory}/${file}`] = { width, variants }
  }
}

await writeFile('app/data/image-variants.json', `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`${Object.keys(manifest).length} images processed`)
