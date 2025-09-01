<h1 align="center">
  rehype-svgo
</h1>

<div align="center">
  <a href="https://npmjs.org/package/rehype-svgo">
    <img src="https://badgen.net/npm/v/rehype-svgo" alt="version" />
  </a>
  <a href="https://github.com/TomerAberbach/rehype-svgo/actions">
    <img src="https://github.com/TomerAberbach/rehype-svgo/workflows/CI/badge.svg" alt="CI" />
  </a>
  <a href="https://unpkg.com/rehype-svgo/dist/index.js">
    <img src="https://deno.bundlejs.com/?q=rehype-svgo&badge" alt="gzip size" />
  </a>
  <a href="https://unpkg.com/rehype-svgo/dist/index.js">
    <img src="https://deno.bundlejs.com/?q=rehype-svgo&config={%22compression%22:{%22type%22:%22brotli%22}}&badge" alt="brotli size" />
  </a>
  <a href="https://github.com/sponsors/TomerAberbach">
    <img src="https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86" alt="Sponsor" />
  </a>
</div>

<div align="center">
  A <a href="https://github.com/rehypejs/rehype">rehype</a> plugin for optimizing inline SVGs using SVGO.
</div>

## Install

```sh
$ npm i rehype-svgo
```

## Usage

```js
import rehypeParse from 'rehype-parse'
import rehypeStringify from 'rehype-stringify'
import { read } from 'to-vfile'
import { unified } from 'unified'
import rehypeSvgo from 'rehype-svgo'

const file = await unified()
  .use(rehypeParse)
  .use(rehypeSvgo, {
    // https://github.com/svg/svgo#configuration
    svgoConfig: {
      multipass: true,
      plugins: [`preset-default`],
    },
  })
  .use(rehypeStringify)
  .process(await read(`index.html`))

console.log(String(file))
```

Visit [`unified`](https://github.com/unifiedjs/unified)'s documentation for how
to use plugins and [`svgo`](https://github.com/svg/svgo#configuration)'s
documentation for its configuration options.

## Contributing

Stars are always welcome!

For bugs and feature requests,
[please create an issue](https://github.com/TomerAberbach/rehype-svgo/issues/new).

## License

[MIT](https://github.com/TomerAberbach/rehype-svgo/blob/main/license-mit) ©
[Tomer Aberbach](https://github.com/TomerAberbach) \
[Apache 2.0](https://github.com/TomerAberbach/rehype-svgo/blob/main/license-apache) ©
[Google](https://github.com/TomerAberbach/rehype-svgo/blob/main/notice-apache)
