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
import { fromHtmlIsomorphic as fromHtml } from 'hast-util-from-html-isomorphic'
import type { Plugin } from 'unified'
import { optimize } from 'svgo'
import type { Config } from 'svgo'

/**
 * A `rehype` plugin that optimizes all inline SVGs in the given HTML using
 * `svgo`.
 */
const rehypeSvgo: Plugin<
  [(Readonly<RehypeSvgoOptions> | null | undefined)?],
  Root,
  Root
> = options => {
  const { svgoConfig } = options ?? {}
  return (tree: Root) =>
    visit(tree, { tagName: `svg` }, (node, index, parent) => {
      const optimizedAst: Node = fromHtml(
        optimize(toHtml(node, { space: `svg` }), svgoConfig).data,
        { fragment: true },
      )

      parent!.children.splice(index!, 1, optimizedAst as Element)
    })
}

/** Options for {@link rehypeSvgo}. */
export type RehypeSvgoOptions = {
  /**
   * The config to pass to `svgo`. Defauls to the default `svgo` config.
   *
   * See https://github.com/svg/svgo#configuration for configuration options.
   */
  svgoConfig?: Config
}

export default rehypeSvgo
