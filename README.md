# apple-app-site-association

Check apple-app-site-association file.
It works with `swcutil` command that is preinstalled in macOS.

## Usage

Test universal links:

```sh
# swcutil command requires root permission
sudo node --test --experimental-strip-types # `--experimental-strip-types` is required node@22
```

```typescript
// test-universallinks.test.ts
import * as assert from "node:assert";
import { test } from "node:test";
import { verify, type AppleAppSiteAssociation } from "apple-app-site-association";
const json = { applinks: { /* ... */ } } satisfies AppleAppSiteAssociation;
test("/search/ should match", async () => {
	const actual: 'match' | 'block' | 'unset' = await verify("example.com", "/search/", json);
	assert.strictEqual(actual, "match");
});
```

Use `swcutil` command programmatically:

```typescript
import { swcutil } from 'apple-app-site-association/swcutil';
const { status, stdout, stderr } = await swcutil({
  // ...
});
```
