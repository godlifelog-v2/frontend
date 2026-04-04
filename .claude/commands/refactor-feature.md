# Feature Refactoring Skill

Refactor legacy code for a given domain into the `features/{domain}/` structure.

## Usage
```
/refactor-feature {domain}
e.g. /refactor-feature challenge
```

## Steps

### Step 1: Assess current state
Locate all legacy code for the domain in:
- `src/pages/{Domain}/` — page components
- `src/components/{domain}/` — domain components
- `src/utils/` — related utilities

Also check the current route config:
- `src/app/router/featureRouters/{domain}Routes.js`

### Step 2: Classify files

| Category | Legacy location |
|----------|----------------|
| **pages/** | `src/pages/{Domain}/*.js` |
| **components/** | `src/components/{domain}/*.js` |
| **hooks/** | Inline logic inside components → extract |
| **services/** | axios calls inside components/hooks → extract |

**Move to shared if:** used by 2+ domains → `src/shared/`

### Step 3: File creation order
1. `services/{domain}Service.js` — extract API calls first
2. `hooks/use{Feature}.js` — business logic hook (uses service)
3. `components/*.js` — migrate/clean UI components
4. `pages/*.js` — page components (compose hook + components)
5. `index.js` — export pages only

### Step 4: Update routes
In `src/app/router/featureRouters/{domain}Routes.js`, update import paths to point to the new `features/{domain}` module.

### Step 5: Verification checklist
- [ ] Existing route paths still work
- [ ] API calls succeed (`axiosInstance` used)
- [ ] Auth-required pages connected to AuthContext
- [ ] No remaining legacy file imports

### Step 6: ESLint validation
Run ESLint on the refactored files:

```bash
npx eslint src/features/{domain}/ --ext .js,.jsx
```

- Fix any **errors** and re-validate.
- Report **warnings** to the user.

### Step 7: Legacy cleanup
After refactoring is confirmed working, ask the user before deleting:
- `src/pages/{Domain}/`
- `src/components/{domain}/`

---

## Code patterns

### services pattern
```js
import axiosInstance from '@/shared/api/axiosInstance';

export const fetch{Domain}List = async (params) => {
  const response = await axiosInstance.get('/api/{domain}', { params });
  return response.data;
};

export const create{Domain} = async (data) => {
  const response = await axiosInstance.post('/api/{domain}', data);
  return response.data;
};
```

### hooks pattern
```js
import { useState, useEffect, useCallback } from 'react';
import { fetch{Domain}List } from '../services/{domain}Service';
import { useToast } from '@/shared/components/ui/use-toast';

export const use{Domain}List = () => {
  const { toast } = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetch{Domain}List();
      setData(result);
    } catch (err) {
      toast({ variant: 'destructive', description: '불러오기 실패' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  return { data, loading, reload: load };
};
```

### index.js pattern
```js
export { default as {Domain}ListPage } from './pages/{Domain}List';
export { default as {Domain}DetailPage } from './pages/{Domain}Detail';
```
