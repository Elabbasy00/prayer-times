# Contributing to Mobile Starter

Thank you for your interest in contributing! This document outlines the process and guidelines for contributing to this project.

## 🚀 Development Setup

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/my-feature`

## 📝 Code Style Guidelines

### TypeScript

- Use TypeScript for all new files
- Define proper types/interfaces
- Avoid `any` type when possible
- Use strict null checks

### React/React Native

- Use functional components with hooks
- Follow React hooks rules
- Keep components focused and single-purpose
- Use meaningful component and prop names

### Naming Conventions

- **Files**: PascalCase for components (`Button.tsx`), camelCase for utilities (`formatters.ts`)
- **Components**: PascalCase (`MyComponent`)
- **Functions/Variables**: camelCase (`handleSubmit`, `isLoading`)
- **Constants**: UPPER_SNAKE_CASE (`API_URL`)
- **Interfaces/Types**: PascalCase with `I` prefix optional (`User`, `IUser`)

### Code Organization

```typescript
// 1. Imports (grouped and ordered)
import React from 'react';
import { View, Text } from 'react-native';

import { CustomComponent } from '@components';
import { useCustomHook } from '@hooks';
import { formatDate } from '@utils';

// 2. Types/Interfaces
interface Props {
  title: string;
  onPress: () => void;
}

// 3. Component
export const MyComponent: React.FC<Props> = ({ title, onPress }) => {
  // 4. Hooks
  const customValue = useCustomHook();

  // 5. Functions
  const handlePress = () => {
    onPress();
  };

  // 6. Render
  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
};

// 7. Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

## 🧪 Testing

- Write tests for new features
- Maintain or improve code coverage
- Run tests before submitting: `npm test`
- Follow the existing test patterns

## 📋 Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Other changes (maintenance, etc.)

### Examples

```
feat(auth): add social login support

Implemented Google and Facebook authentication
using react-native-community packages.

Closes #123
```

```
fix(navigation): resolve deep linking issue

Fixed issue where deep links weren't properly
routing to the correct screen.
```

## 🔀 Git Workflow

### Branches

- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: New features
- `fix/*`: Bug fixes
- `hotfix/*`: Urgent production fixes

### Pull Request Process

1. **Create a Branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make Changes**
   - Write code following our guidelines
   - Add tests if applicable
   - Update documentation

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add my feature"
   ```

4. **Push to Fork**
   ```bash
   git push origin feature/my-feature
   ```

5. **Open Pull Request**
   - Provide clear title and description
   - Reference related issues
   - Request reviews from maintainers

6. **Address Feedback**
   - Make requested changes
   - Push updates to the same branch

7. **Merge**
   - Maintainers will merge when approved

## ✅ Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code follows style guidelines
- [ ] TypeScript types are properly defined
- [ ] Tests pass (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] Code is formatted (`npm run format`)
- [ ] Documentation is updated
- [ ] Commit messages follow conventions
- [ ] Branch is up to date with main/develop

## 📦 Adding Dependencies

When adding new dependencies:

1. Discuss in an issue first for major dependencies
2. Use exact versions or tight version ranges
3. Update documentation
4. Consider bundle size impact
5. Ensure compatibility with React Native

```bash
# Add dependency
npm install package-name

# For iOS, update pods
cd ios && bundle exec pod install && cd ..
```

## 🐛 Reporting Bugs

When reporting bugs, include:

- Clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/videos if applicable
- Environment details (OS, device, versions)
- Relevant error messages/logs

## 💡 Suggesting Features

When suggesting features:

- Check existing issues first
- Provide clear use case
- Explain benefits
- Consider implementation complexity
- Discuss potential alternatives

## 📖 Documentation

- Update README for user-facing changes
- Add code comments for complex logic
- Update TypeScript types/interfaces
- Document breaking changes clearly

## 🎯 Code Review

Reviewers will check for:

- Code quality and style
- Test coverage
- Performance implications
- Breaking changes
- Documentation completeness
- Security concerns

## 🚫 What NOT to Do

- Don't commit directly to main
- Don't include unrelated changes
- Don't ignore linting errors
- Don't skip tests
- Don't use `any` type without good reason
- Don't add unnecessary dependencies

## 📫 Getting Help

- Open a discussion for questions
- Join our community chat (if applicable)
- Tag maintainers for urgent issues
- Be patient and respectful

## 📜 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

Thank you for contributing! 🎉
