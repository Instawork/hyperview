---
author: Hardin Gray
authorURL: https://github.com/hgray-instawork
title: Out with the old
---

Every mature codebase eventually needs a thorough spring cleaning. Over the last few months, we've been working hard on improvements to Hyperview, removing legacy code, improving render performance, refining APIs, and building a better product.

## Performance Improvements

One of the most significant improvements in recent releases is a substantial reduction in view redraws throughout Hyperview. Starting with **version 0.94.0**, our optimization work has streamlined the rendering pipeline, resulting in measurably better performance across the framework, providing up to a 50% reduction in render time and re-renders.

These improvements mean your Hyperview apps will feel smoother and more responsive, especially in complex screens with frequent updates or dynamic content.

## Code Cleanup and Consolidation

It has been over a year since we [released an integrated navigation solution](https://hyperview.org/blog/2024/05/14/Hyperview-Navigation) into Hyperview, marking a major milestone in the framework's evolution. The integrated navigation has been very successful in providing the flexibility and features that both our internal team and the broader Hyperview community have come to rely on.

With this solid foundation in place, we removed support for external navigation several months ago, allowing us to focus on a single solution. This significantly simplified our internal architecture and allowed us to consolidate functionality.

## Updated public API

Beyond performance gains, we've completely overhauled Hyperview's public API. We've eliminated the need to reach into internal modules and provided a clean, well-organized interface that makes common tasks simpler and more intuitive.

**Before:**
```typescript
// Old way - reaching into internals
import { createProps } from 'hyperview/src/services/dom/helpers';
import { renderElement } from 'hyperview/src/services/render/index';
import { Parser } from 'hyperview/src/services/dom/parser';
```

**After:**
```typescript
// New way - clean public API
import { createProps, renderElement, Parser } from 'hyperview';
```

## What's next?

Developers should update their imports to use the new public API for better TypeScript support. We will be deprecating previous paths in a future release. Check out the updated demo which includes many improvements and bug fixes including a more consistent implementation of safe area examples.

Looking ahead, the cleanup work in this release enables us to move faster on new features and improvements. We're already seeing the benefits internally, with faster development cycles and fewer bugs.

As always, we're here to help if you run into any issues—don't hesitate to [reach out](https://github.com/Instawork/hyperview/issues) with questions or feedback.
