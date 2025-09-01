import fs from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import rehypeParse from 'rehype-parse'
import rehypeStringify from 'rehype-stringify'
import { unified } from 'unified'
import { expect, test } from 'vitest'
import rehypeSvgo from './index.ts'

const fixturesPath = join(dirname(fileURLToPath(import.meta.url)), `fixtures`)
const htmls = await Promise.all(
  (await fs.readdir(fixturesPath)).map(async name => ({
    name,
    html: await fs.readFile(join(fixturesPath, name), `utf8`),
  })),
)

test.each(htmls)(`rehypeSvgo works with config - $name`, ({ html }) => {
  const optimizedHtml = String(
    unified()
      .use(rehypeParse)
      .use(rehypeSvgo, {
        svgoConfig: {
          multipass: true,
          plugins: [
            {
              name: `preset-default`,
              params: { overrides: { inlineStyles: false } },
            },
          ],
        },
      })
      .use(rehypeStringify)
      .processSync(html),
  )

  expect(optimizedHtml).toMatchSnapshot()
})

test.each(htmls)(`rehypeSvgo works without config - $name`, ({ html }) => {
  const optimizedHtml = String(
    unified()
      .use(rehypeParse)
      .use(rehypeSvgo)
      .use(rehypeStringify)
      .processSync(html),
  )

  expect(optimizedHtml).toMatchSnapshot()
})
