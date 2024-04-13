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

import { visit } from 'unist-util-visit'
import type { Element, Node, Root } from 'hast'
import { toHtml } from 'hast-util-to-html'
import rehypeParse from 'rehype-parse'
import type { Plugin } from 'unified'
import { unified } from 'unified'
import { optimize } from 'svgo'
import type { Config } from 'svgo'
import { find } from 'unist-util-find'

/**
 * A `rehype` plugin that optimizes all inline SVGs in the given HTML using
 * `svgo`.
 */
const rehypeSvgo: Plugin<
  [(RehypeSvgoOptions | null | undefined)?],
  Root,
  Root
> = options => {
  const { svgoConfig } = options ?? {}
  return (tree: Root) =>
    visit(tree, { tagName: `svg` }, (node, index, parent) => {
      const optimizedAst: Node = unified()
        .use(rehypeParse, { space: `svg` })
        .parse(optimize(toHtml(node, { space: `svg` }), svgoConfig).data)

      // Parsing may add extraneous html, head, and body tags. Find the actual
      // SVG element.
      const svgElement = find(optimizedAst, { tagName: `svg` })
      if (!svgElement) {
        throw new Error(`Expected SVG element`)
      }

      // The SVG element is never the root. There's always a root node.
      if (!parent) {
        throw new Error(`Expected parent`)
      }
      parent.children.splice(index!, 1, svgElement as Element)
    })
}

/** Options for {@link rehypeSvgo}. */
export type RehypeSvgoOptions = {
  /** The config to pass to `svgo`. Defauls to the default `svgo` config. */
  svgoConfig?: Config
}

export default rehypeSvgo
