# universal-links-test

Check apple-app-site-association file to verify universal links.

## Installation

```sh
npm install -D universal-links-test
```

## Usage

The `verify` function detects provided path lauches the app or not.

It depends on the `swcutil` command (preinstalled in macOS), so you must use this function in macOS and root permission.
If you don't use macOS, you can use `universal-links-test/sim` instead that simulates the behavior.

```typescript
import { verify, type AppleAppSiteAssociation } from "universal-links-test";
// import { verify, type AppleAppSiteAssociation } from "universal-links-test/sim";

const json = {
  applinks: {
    details: [
      {
        appID: "APP.ID1",
        components: [{ "/": "/universal-links/path" }]
      },
      {
        appID: "APP.ID2",
        components: [{ "/": "/universal-links/path", exclude: true }]
      },
      {
        appID: "APP.ID3",
        components: []
      }
    ]
  }
} satisfies AppleAppSiteAssociation;

const result: Map<string, 'match' | 'block'> = await verify(json, "/universal-links/path?query#hash");
console.log(result.get("APP.ID1")); // 'match' : Universal links are working
console.log(result.get("APP.ID2")); // 'block' : Universal links are blocked
console.log(result.get("APP.ID3")); // undefined
```

Use `swcutil` command programmatically:

```typescript
import { swcutil } from 'universal-links-test/swcutil';
const { status, stdout, stderr } = await swcutil({
  // ...
});
```

## LICENSE

MIT
