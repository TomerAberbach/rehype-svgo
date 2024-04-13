/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import fs from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import rehypeParse from 'rehype-parse'
import rehypeStringify from 'rehype-stringify'
import { unified } from 'unified'
import rehypeSvgo from '../src/index.ts'

const fixturesPath = join(dirname(fileURLToPath(import.meta.url)), `fixtures`)
const htmls = await Promise.all(
  (await fs.readdir(fixturesPath)).map(async name => ({
    name,
    html: await fs.readFile(join(fixturesPath, name), `utf8`),
  })),
)

test.each(htmls)(`rehypeSvgo works - $name`, ({ html }) => {
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
