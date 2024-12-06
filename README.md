# apple-app-site-association

Check apple-app-site-association file.
It works with `swcutil` command that is preinstalled in macOS.

## Usage

The `verify` function detects provided path lauches the app or not.

It depends on the `swcutil` command, so you must use this function in macOS and root permission.
(If you don't like it, you can use `apple-app-site-association/sim` instead that simulates the behavior.)

```typescript
import { verify, type AppleAppSiteAssociation } from "apple-app-site-association";

const json = { applinks: { /* ... */ } } satisfies AppleAppSiteAssociation;

const result = await verify(json, "/universal-links/path?query#hash");
console.log(result); // 'match' | 'block' | 'unset'
```

Use `swcutil` command programmatically:

```typescript
import { swcutil } from 'apple-app-site-association/swcutil';
const { status, stdout, stderr } = await swcutil({
  // ...
});
```
