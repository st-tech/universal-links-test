# universal-links-test

Check apple-app-site-association file to verify universal links.

## Usage

The `verify` function detects provided path lauches the app or not.

It depends on the `swcutil` command (preinstalled in macOS), so you must use this function in macOS and root permission.
If you don't use macOS, you can use `universal-links-test/sim` instead that simulates the behavior.

```typescript
import { verify, type AppleAppSiteAssociation } from "universal-links-test";
// import { verify, type AppleAppSiteAssociation } from "universal-links-test/sim";

const json = { applinks: { /* ... */ } } satisfies AppleAppSiteAssociation;

const result = await verify(json, "/universal-links/path?query#hash");
console.log(result); // 'match' | 'block' | 'unset'
```

Use `swcutil` command programmatically:

```typescript
import { swcutil } from 'universal-links-test/swcutil';
const { status, stdout, stderr } = await swcutil({
  // ...
});
```
