# apple-app-site-association

Check apple-app-site-association file.

## Usage

Reference types:

```typescript
import type { AppleAppSiteAssociation } from 'apple-app-site-association';
const aasa = {
  applinks: {
    // ...
  }
} as const satisfies AppleAppSiteAssociation;
```

Test universal links:

```typescript
import { test } from 'node:test';
import { createAssert } from 'apple-app-site-association';
const assert = createAssert(YOUR_DOMAIN, AASA_JSON);
test("universal link works", async () => {
  await assert.universalLink("/path/to/your/app", "match");
  await assert.universalLink("/#donot_deeplinking", "block");
});
```

Use `swcutil` command directly:

```typescript
import { swcutil } from 'apple-app-site-association/swcutil';
const { status, stdout, stderr } = await swcutil({
  // ...
});
```
