---
author: Hardin Gray
authorURL: https://github.com/hgray-instawork
title: Out with the old
---

Every mature codebase eventually needs a thorough spring cleaning. Over the last few months, we've been working hard on improvements to Hyperview, removing legacy code, refining APIs, improving render performance, and building a better product.

## Performance Improvements

One of the most significant improvements in recent releases is a substantial reduction in view redraws throughout Hyperview. Starting with **version 0.94.0**, our optimization work has streamlined the rendering pipeline, resulting in measurably better performance across the framework. We have seen up to 50% reduction in render time and re-renders.

**Key performance enhancements:**
- **Reduced View Redraws**: Significant optimization of when and how components re-render, eliminating unnecessary view updates
- **Optimized Element Processing**: More efficient rendering pipeline reduces overhead and improves frame rates
- **Enhanced Error Handling**: Better error messages and more graceful failure modes help with debugging
- **Stronger Type Safety**: Eliminated entire classes of runtime errors through better TypeScript coverage

These improvements mean your Hyperview apps will feel smoother and more responsive, especially in complex screens with frequent updates or dynamic content.

## Code Cleanup and Consolidation

It has been over a year since we [released an integrated navigation solution](https://hyperview.org/blog/2024/05/14/Hyperview-Navigation) into Hyperview, marking a major milestone in the framework's evolution. The integrated navigation has been very successful in providing the flexibility and features that both our internal team and the broader Hyperview community have come to rely on.

With this solid foundation in place, we've been able to remove redundant code and consolidate functionality across the codebase. Support for external navigation was removed several months ago, allowing us to focus on a single solution. This cleanup eliminates legacy code and simplifies our internal architecture significantly.

## Enhanced Developer Experience

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

**Key improvements include:**
- **Enhanced TypeScript Support**: Better type definitions with improved IntelliSense and compile-time error checking
- **Consolidated Exports**: All commonly-used functions now available from the main import
- **Backward Compatibility**: Existing code continues to work while you migrate to the new APIs
- **Better Documentation**: Cleaner API surface makes it easier to understand what's available

## What's Next

**For developers using Hyperview:**
1. Consider updating your imports to use the new public API for better TypeScript support
2. Take advantage of improved error messages and better debugging capabilities
3. Explore the updated demo app examples for best practices and new patterns

**Looking ahead:**
The cleanup work in this release enables us to move faster on new features and improvements. We're already seeing the benefits internally, with faster development cycles and fewer bugs. We expect the same improvements will benefit the broader Hyperview ecosystem.

We encourage all users to upgrade and experience the improvements for themselves. As always, we're here to help if you run into any issues—don't hesitate to [reach out](https://github.com/Instawork/hyperview/issues) with questions or feedback.

## Thank You

Special thanks to everyone who has contributed to Hyperview's development and provided feedback that shaped these improvements. Your input has been invaluable in making Hyperview better for everyone.
