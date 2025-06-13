# Alphabetical Sorting Rule

## Overview

This rule ensures consistent code organization and improved readability by requiring alphabetical sorting of dependency arrays and destructured objects throughout the codebase.

## Scope

This rule applies to:

- React hook dependency arrays
- Destructured function parameters
- Destructured variable assignments
- Object destructuring in any context
- Array destructuring when meaningful

## React Hook Dependency Arrays

### useEffect

```typescript
// ✅ Correct - alphabetically sorted
useEffect(() => {
  // effect logic
}, [elementA, elementB, onUpdate, options, stylesheets]);

// ❌ Incorrect - not sorted
useEffect(() => {
  // effect logic
}, [onUpdate, elementA, stylesheets, options, elementB]);
```

### useCallback

```typescript
// ✅ Correct - alphabetically sorted
const handlePress = useCallback(() => {
  // handler logic
}, [element, onSelect, onToggle, value]);

// ❌ Incorrect - not sorted
const handlePress = useCallback(() => {
  // handler logic
}, [value, onSelect, element, onToggle]);
```

### useMemo

```typescript
// ✅ Correct - alphabetically sorted
const computedValue = useMemo(() => {
  return expensive computation;
}, [data, isLoading, userInput]);

// ❌ Incorrect - not sorted
const computedValue = useMemo(() => {
  return expensive computation;
}, [userInput, data, isLoading]);
```

### Custom Hooks

```typescript
// ✅ Correct - alphabetically sorted
const { data, error, loading } = useCustomHook([
  apiEndpoint,
  filters,
  pagination,
  sortOrder,
]);

// ❌ Incorrect - not sorted
const { data, error, loading } = useCustomHook([
  filters,
  apiEndpoint,
  sortOrder,
  pagination,
]);
```

## Function Parameters

### Props Destructuring

```typescript
// ✅ Correct - alphabetically sorted
const MyComponent = ({ className, id, onPress, title }: Props) => {
  // component logic
};

// ❌ Incorrect - not sorted
const MyComponent = ({ onPress, title, id, className }: Props) => {
  // component logic
};
```

### Function Arguments

```typescript
// ✅ Correct - alphabetically sorted
const processData = ({
  filters,
  options = {},
  sortBy,
  userId,
}: ProcessDataParams) => {
  // processing logic
};

// ❌ Incorrect - not sorted
const processData = ({
  userId,
  filters,
  options = {},
  sortBy,
}: ProcessDataParams) => {
  // processing logic
};
```

## Variable Destructuring

### Object Destructuring

```typescript
// ✅ Correct - alphabetically sorted
const { error, isLoading, response, status } = apiCall();

// ❌ Incorrect - not sorted
const { response, error, status, isLoading } = apiCall();
```

### Nested Destructuring

```typescript
// ✅ Correct - alphabetically sorted
const {
  user: { email, id, name },
  settings: { notifications, theme },
} = userData;

// ❌ Incorrect - not sorted
const {
  user: { name, id, email },
  settings: { theme, notifications },
} = userData;
```

### With Default Values

```typescript
// ✅ Correct - alphabetically sorted (ignoring defaults)
const { autoSave = true, maxItems = 100, theme = 'light', userId } = config;

// ❌ Incorrect - not sorted
const { userId, theme = 'light', autoSave = true, maxItems = 100 } = config;
```

## Array Destructuring

### When Meaningful

```typescript
// ✅ Acceptable - positional meaning preserved
const [loading, setLoading] = useState(false);
const [first, second, third] = coordinates;

// ✅ Correct - when renaming, sort alphabetically
const [error, loading, response] = [apiError, isLoading, apiResponse];

// ❌ Incorrect - arbitrary reordering loses meaning
const [setLoading, loading] = useState(false); // Wrong order
```

## Import Statements

### Named Imports

```typescript
// ✅ Correct - alphabetically sorted
import {
  Component,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

// ❌ Incorrect - not sorted
import {
  useState,
  Component,
  useEffect,
  Fragment,
  useMemo,
  useCallback,
} from 'react';
```

### Multiple Import Lines

```typescript
// ✅ Correct - each line sorted internally
import { Button, Input, Modal } from './components';
import { formatDate, parseJson, validateEmail } from './utils';
import { API_ENDPOINTS, THEMES } from './constants';

// ❌ Incorrect - not sorted within lines
import { Modal, Button, Input } from './components';
import { validateEmail, formatDate, parseJson } from './utils';
import { THEMES, API_ENDPOINTS } from './constants';
```

## Special Cases

### With Rest Parameters

```typescript
// ✅ Correct - rest parameter at end, others sorted
const { id, name, ...restProps } = props;
const handleUpdate = useCallback(() => {
  // logic
}, [id, name, ...otherDeps]); // Sort before spread
```

### With Renamed Properties

```typescript
// ✅ Correct - sort by destructured name, not original
const { id: userId, email: userEmail, name: userName } = user;
```

### Multiline Arrays

```typescript
// ✅ Correct - one item per line when long, sorted alphabetically
const dependencies = [
  'element',
  'getCommonProps',
  'getScrollViewProps',
  'hasInputFields',
  'onUpdate',
  'options',
  'stylesheets',
];

// ✅ Also correct - short arrays can be inline
const deps = [element, onUpdate, options];
```

## Formatting Guidelines

### Line Breaks

```typescript
// ✅ Preferred for long dependency arrays
const value = useMemo(() => {
  return computation;
}, [longVariableName, anotherLongVariableName, yetAnotherLongVariableName]);

// ✅ Acceptable for short arrays
const value = useMemo(() => computation, [a, b, c]);
```

### Consistent Spacing

```typescript
// ✅ Consistent spacing
const { element, onUpdate, options, stylesheets } = props;

// ❌ Inconsistent spacing
const { element, onUpdate, options, stylesheets } = props;
```

## Exceptions

### When NOT to Apply

1. **Positional Arrays**: When order has semantic meaning (coordinates, RGB values, etc.)
2. **API Requirements**: When external APIs require specific ordering
3. **Performance Critical**: When reordering would affect performance (rare)
4. **Existing Patterns**: When breaking established patterns in legacy code would cause more harm

### Documentation Required

When exceptions are made, document the reason:

```typescript
// Order maintained for API compatibility - do not sort
const [latitude, longitude, altitude] = coordinates;

// Performance critical - order optimized for execution
const deps = [fastCheck, expensiveCheck]; // Fast check first
```

## Benefits

1. **Consistency**: Uniform code style across the entire codebase
2. **Readability**: Easier to scan and find specific dependencies
3. **Merge Conflicts**: Reduces conflicts when multiple developers modify the same arrays
4. **Debugging**: Easier to spot missing or duplicate dependencies
5. **Code Reviews**: Faster to review when formatting is predictable

## Tools and Automation

### ESLint Rules

Consider configuring ESLint rules for automatic sorting:

- `sort-keys` for object properties
- Custom rules for dependency arrays
- `import/order` for import statements

### IDE Configuration

Set up your IDE to:

- Auto-sort on save
- Highlight unsorted arrays
- Provide quick-fix actions

## Migration Strategy

### Existing Code

1. **Gradual Migration**: Apply rule to new code and files being modified
2. **File-by-File**: Update entire files when making substantial changes
3. **Automated Tools**: Use scripts or IDE features for bulk updates

### Team Adoption

1. **Documentation**: Share this rule with the team
2. **Code Reviews**: Enforce during review process
3. **Linting**: Add automated checks to prevent violations
4. **Examples**: Provide clear examples for common patterns

## Examples by Component Type

### React Components

```typescript
const MyComponent = React.memo(
  ({ element, onUpdate, options, stylesheets }: Props) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = useCallback(() => {
      // logic
    }, [element, onUpdate]);

    const computedStyle = useMemo(() => {
      // computation
    }, [element, options, stylesheets]);

    return <div />;
  },
);
```

### Custom Hooks

```typescript
export const useCustomHook = (dependencies: string[]) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // effect logic
  }, [data, dependencies, setData]);

  return { data, isLoading, error };
};
```

### Utility Functions

```typescript
export const processUserData = ({
  email,
  id,
  name,
  preferences = {},
}: UserData) => {
  const { notifications, privacy, theme } = preferences;

  return {
    email,
    id,
    name,
    settings: { notifications, privacy, theme },
  };
};
```

This rule should be applied consistently across all TypeScript/JavaScript files in the project to maintain code quality and readability.
