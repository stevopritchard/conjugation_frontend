# Testing Notes

## Setting up Testing Environment - [May 6, 2026]

# Uninstalling Unwanted Packages
I have chosen [React Testing Libray](https://github.com/testing-library/react-testing-library) as it's the standard for React component testing. I have also decided to carry on using **Vitest** as a test runner, primarily because it was the test runner used in the course that I have just finished.
Other packages in the stack that will be used:

- **@testing-library/user-event** to simulate user interactions by dispatching events that would happen if the interaction took place in the browser
- **jsdom**: Claude's suggestion. Vitest uses this by default, though jest-dom is also an option. 

Before installing these packages, I had to delete some obselete versions of the testing packages.

`npm uninstall @testing-library/jest-dom @testing-library/react @testing-library/user-event`

...this lead to a ERESOLVE dependency conflict because react-scripts@5.0.1 (installed with CRA when the project was set up initially) only supports TypeScript up to version 4 (this project currently uses TypeScript ^5.9.3) and CRA doesn't support TypeScript 5. Claude believes that this version of TypeScript was installed using `--legacy-peer-deps` to bypass peer dependencies.

The most straightforward solution was to use that same command to delete the packages without resolving the dependency issue with react-scripts:

`npm uninstall @testing-library/jest-dom @testing-library/react @testing-library/user-event --legacy-peer-deps`

### Packages Installed
All of the required packages were installed with the following command:

`npm install --save-dev vitest @vitejs/plugin-react @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom --legacy-peer-deps`

Note that peer dependency issues are still being ignored to avoid a long diversion into fully resolving these issues. This is satisfactory for this stage, but might be work looking into further at the deployment phase.

The following packages were installed as dev dependencies:

- [@vitejs/plugin-react](https://www.npmjs.com/package/@vitejs/plugin-react)
- [React Testing Library(@testing-library/react)](https://testing-library.com/docs/react-testing-library/intro)
- [user-event](@testing-library/user-event)
- [@testing-library/jest-dom](https://testing-library.com/docs/ecosystem-jest-dom/)
- [jsdom](https://github.com/jsdom/jsdom)

### Roles of Each Tool

- **@vitejs/plugin-react**, a Vite plugin for React projects (*note: Vitest uses Vite under the hood, and this plugin is what tells Vite how to handle .tsx files — JSX transformation, TypeScript compilation, and React's Fast Refresh. Without it, Vitest would error on any file containing JSX.*).
- **React Testing Library** offers an API to work with React components, out of the box
- **user-event** allows test to emulate user-events or scenarios that would be triggered by user interaction in the browser
- **jest-dom** provides custom matchers that extend `expect` — things like `toBeInTheDocument()`, `toHaveTextContent()`, `toBeDisabled()`. Without it, you'd have to write more verbose assertions. It makes your test expectations readable.
- **jsdom** the virtual environment that is supported by Vitest (*note that Vitest's default environment is node. jsdom must be installed separately and explicitly configured, which is what environment: 'jsdom' in the config does.*)

### Files Created

- vitest.config.ts — *a file the makes available our test configuration to Vitest, when run.*

```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    css: false,
  },
});
```

Note the `globals` property that is set to `true`; this makes frequently-used methods suchs as `describe`, `it`, and `expect` available in every test file without import.

- src/setupTests.ts — *imports custom jest-dom matchers and registers its custom matchers globally. It runs before every test file because of setupFiles in the config.* For more information, refer to [jest-dom set documentation](https://github.com/testing-library/jest-dom#usage) and the use of the `setupFiles` property in the [Vitest config API docs](https://vitest.dev/config/setupfiles.html)

### Running Tests

The testing enviroment is run with the command `npm test`.
Vitest runs in watch mode by default in development, rerunning on file save. For CI or a single run use `vitest run`.

## Making Vitest globals available to TypeScript compiler (10 May 2026)

### Problem Found

- **Missing dependency: '@testing-library/dom'**
The very first problem encountered when trying to run this most basic of tests:

```typescript
it('[setup test]', () => {
  expect(true).toBe(true);
});
```

This test failed due to a dependency error:

```console
 FAIL  src/components/Scroll/Scroll.test.js [ src/components/Scroll/Scroll.test.js ]
Error: Cannot find module '@testing-library/dom'
Require stack:
- /Users/stephenpritchard/Developer/Projects/conjugation-refactor/conjugation_frontend/node_modules/@testing-library/react/dist/pure.js
 ❯ Object.<anonymous> node_modules/@testing-library/react/dist/pure.js:46:12
```

- **Testing file unable to parse JSX expressions**
 When attempting to run /Scroll.test.ts:

 ```console
  FAIL  src/components/Scroll/Scroll.test.js [ src/components/Scroll/Scroll.test.js ]
  Error: Transform failed with 1 error:

  [PARSE_ERROR] Error: Unexpected JSX expression
    ╭─[ src/components/Scroll/Scroll.test.js:6:10 ]
    │
  6 │   render(<Scroll />);
    │          ─────┬────  
    │               ╰────── 
    │ 
    │ Help: JSX syntax is disabled and should be enabled via the parser options
  ───╯
 ```

- **TypeScript flagging global Vitest APIs**

 The Vitest configuration exposes its APIs globally, however a **TypeScript diagnostic error** was occured when trying to use the `describe` method in my Scroll test file:

  ```console
    Cannot find name 'describe'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha`.
  ```
### Research

 From the [vitest docs](https://vitest.dev/config/globals.html#globals):

 *To get TypeScript working with the global APIs, add vitest/globals to the types field in your tsconfig.json:*

 ```json
  {
    "compilerOptions": {
      "types": ["vitest/globals"]
    }
  }
 ```

### Solution

- **Missing dependency: '@testing-library/dom'**
Installed the missing dependency:
`npm install --save-dev @testing-library/dom --legacy-peer-deps`

Note that we once again used the `--legacy-peer-deps` option to install `@testing-library/dom`, likely because of the other aforementioned conflict with `react-scripts`.

- **Testing file unable to parse JSX expressions**
 Rename the test file to /Scroll.test.tsx

- **TypeScript flagging global Vitest APIs**
 Add this to compilerOptions in tsconfig.json:

 `"types": ["vitest/globals"]`

 This tells TypeScript's type checker that Vitest's globals (describe, it, expect) exist, which is separate from making them available at runtime.

 Note that if types is specified, only packages listed will be included in the global scope. For more info: <<https://www.typescriptlang.org/tsconfig/#types>>.

 Since I have explicitely imported all of the types used in the project code, this will not affect the project at compile time.

### Key Learnings

- NPM would have normally prevented the installation of `@testing-library/react` due to the fact that the project was missing `@testing-library/dom`. It's a peer depency, meaning that it's required by `@testing-library/react` but must be installed separated. We used `--legacy-peer-deps` when we installed the `@testing-library/react` package, bypassing NPM's default behaviour.
- .test.tsx files are the required TypeScript file types to handle the conversion of JSX/TSX syntax.
- Third-party type definitions (those outside of `node_modules/@types`) can be made available to the TypeScript compiler via the "types" config option. Read more at: <https://www.typescriptlang.org/tsconfig/#types>.

## Scroll.test.tsx (12 - 13 May 2026)

I intend to run just two tests for this relatively simply component:

- It renders a .scroll div
- It renders its children

### Problems Found

**It renders a .scroll div**
I have had trouble isolating the element passed to `render()` from the rest of the HTML in the virtual DOM.

Since the first test is to verify that the rendered component exists with a class, and there are no other attributes passed to the component except for props, I cannot select the element by its class before the assertion of the test.

**It renders its children**
Having decided to use a manual selector in the previous test, I expected that `render(<Scroll children={child} />).container.querySelector('.scroll');` would return a node represented by the stringified markup. Instead it returns an object of the HTMLDivElement type. 

When arranging my test variable `const child = '<div>I am the child<div>';` I expected that it would be evaluated as the exact same string in the test assertion. Instead the spectial characters in the string are evaluated as HTML entities so "<div>I am the child<div>" is instead "&lt;div&gt;I am the child&lt;/div&gt;".

### Research

**It renders a .scroll div**
When a component is passed to the `render()` method of `@testing-library/react`, it is by default (if not`container` option is specified) by wrapped in a div which is appended to the virtual DOM's `body`. `render(<Scroll />)` produces:

```html
<body>
  <div>
    <div
      class="scroll"
    />
  </div>
</body>
```

I couldn't find an exhaustive list of `render()` properties or methods on <<https://testing-library.com/docs/react-testing-library/api>> so instead I logged the method to the console and discovered the `asFragment()` method. This method returns a `DocumentFragment` type value, which does isolate the component element's markup from the virtualDOM. The problem is that jest-dom's custom matchers (for example `toHaveClass()`) only accept values with an HTMLElement or an SVGElement type.
Vitest's matchers are, however, more flexible and do accept DocumentFragment values, so the following test works:

```typescript
it('should render a div with the class `.scroll`', () => {
    const { asFragment } = render(<Scroll children={''} />);

    expect(asFragment()).toMatchSnapshot(`
      <div
        class="scroll"
      />
    `);
  });
```

However I was not satisfied with this because it does not test for the existence of the class specifically, but instead the strutcure of the exposed markup.

### Solution

**It renders a .scroll div**
Looking at the [testing-library Core API docs](https://testing-library.com/docs/queries/about#manual-queries) I happened across Manual Queries, and I used a regular DOM API to attempt to select the element in my assertion and test the success or failure of the outcome:

```typescript
 it('should render a div with the class `.scroll`', () => {
    const { container } = render(<Scroll children={''} />);

    expect(container.querySelector('.scroll')).not.toBeNull();
  });
```

**It renders its children**
The object returned by `container.querySelector()` has the same properties available to it that a NodeList item would have, including `innerHTML`. I was able to use this to set up a simple assersion: `expect(scrollElement?.innerHTML).toEqual(child);`.

I decided to change the arranged test variable to a string without special characters, since they are not integral to establishing the validity of the most basic assertion that satisfies the test.

### Key Learnings

The 'Act' phase of test setup was what I struggled with most in the first test; simply selecting the element in an idiomatic way (that is, using RTL's prescribed methods) was not something that I could achieve. Despite this, it was worthwile exploring what other options are availabe with regards to searching for elements to be used in assertions.

I did not understand the use of the `toMatchSnapshot()` method and inadvertently caused Vitest to create a `_snapshots` folder containing a `.snap` file. I'll keep it round for the time being; if I need to use this method later, this might serve as a useful reminder of how it actually functions.

Idiomatic use of RTL is still something to consider going forward.

## VerbCard.test.tsx (14 May 2026)

### Problems Found

**Limitation of Bootstrap**
The query `screen.getByRole('heading', { name: spanish })` fails to find the card's header element:

`TestingLibraryElementError: Unable to find an accessible element with the role "heading"`

### Research

Upon inspection of the error log:

```console

Here are the accessible roles:

  --------------------------------------------------

Ignored nodes: comments, script, style
<body>
  <div>
    <div
      class="card bg-light"
      style="width: 325px; margin: 20px;"
    >
      <div
        class="card-body"
      >
        <div
          class="card-title h5"
        >
          Ser
        </div>
        <p
          class="card-text"
        />
        <button
          class="btn btn-secondary"
          type="button"
        >
          Select
        </button>
      </div>
    </div>
  </div>
</body>
```

The reason that the query does not work is because the semantic `<h5>` element is nowhere to be found. Bootstrap's `<Card.Title>` uses `.h5` as a utility class, but the element is a standard div, and therefore does not get attributed the [role](https://www.w3.org/TR/html-aria/#docconformance) that is expected.

### Solution

This limits me to using a query similar to the one used in /Scroll/Scroll.test.tsx: 

`expect(container.querySelector('.card-title')?.innerHTML).toEqual(spanish);`

However it's worth noting that this is a fragile test; if the version of Bootstrap was changed and the class names were modified as a result, for instance, this test would fail even though the placement of the text might not necessarily have changed for the user.

Therefore, I am limited to simply testing for the existence of the text in the rendered markup, not its location.

### Key Learnings

Bootstrap's non-semantic markup limits the ability to locate elements by role.

## CardList.test.tsx (18 - 19 May 2026)

### Key Learnings

**No need to import child components**
When a parent is rendered, React renders the full component tree — `render(<CardList verbs={verbs} select={select} />)` renders CardList, VerbCard, everything inside it. The test just sees the final DOM output, and since CardList renders VerbCard internally, it doesn't need to know VerbCard exists.

Therefore there is no need to instantiate VerbCard in this test, despite that fact that those cards are rendered in the test; CardList does that internally.

**Basic mocked function records every call it receives**
In one of the tests, I wanted to confirm that the click event calls `select`  - passed as props to VerbCard - with the expected arguments. The most basic implementation of a spy (`vi.fn()`) can record the arguments passed to it so that it can be check with the assertion [toHaveBeenCalledWith()](https://vitest.dev/api/expect.html#tohavebeencalledwith), meaning that there is no need for configuration.

**Assertion structure**
An assertion requires a method be called on the expect() return object. I had used the following statements as assertions in one of my tests:

```typescript
expect(screen.getByText(verbList[0].infinitive));
```

However, these miss the *actual asserstion*, which is to call a method on the object returned by `expect()`. A complete assertion would therefore be something like:

```typescript
expect(screen.getByText(verbList[0].infinitive)).toBeInTheDocument();
```

## VerbTable.test.tsx (1 - 3 Jun 2026)

### Problems Found

**Mutation of reference type variables**
In the arrangement phase of my tests I  was unintentionally mutating the `INITIAL_CONJUGATION` object instead of writing values to properties on a separate object, because `testConjugation` variable declared was a shallow copy of `INITIAL_CONJUGATION`.

```typescript
  let testConjguation = INITIAL_CONJUGATION;
  // ...
  testConjguation.indicative_present.form_1s = 'Here is a context value';
```

**Accessing markup with few semantic elements**
The VerbTable component is features few semantic elements and absolutely no ids are used. This means that considered queries are required for our assertions. 

**Accessing values of typed object**
I had previously tried to access the conjugations of each tense with the following pattern:

```typescript
    for (let tense in indicativePresent) {
      expect(within(tables[0]).getByText(indicativePresent[tense])).toBeInTheDocument();
    }
```

This produced a type error:

```console
Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'ConjugationForm'.
  No index signature with a parameter of type 'string' was found on type 'ConjugationForm'.
```

### Solution

**Mutation of reference type variables**
Using the `structuredClone()` method is the cleanest was to create a deep copy of an object, and is more performative than stringifying and then building of a new object.

```typescript
  beforeEach(() => {
    testConjguation = structuredClone(INITIAL_CONJUGATION);
  });
```

**Accessing markup with few semantic elements**
Using the `<table></ table>` semantic element is ideal because each tense is separated into its own table. We can therefore create an array of these nodes using the `getAllByRole()` RTL method:

```typescript
  const tables = screen.getAllByRole('table');
```

**Accessing values of typed object**
Since the keys of tenses are not required, I used a different pattern to circumvent the issue:

```typescript
  for (const tense of Object.values(subjunctivePresent)) {
    expect(within(tables[2]).getAllByText(tense)[0]).toBeInTheDocument();
  }
```
See 'Key Learnings' for a solution that preserves the previous pattern.

### Key Learnings
The `for...in` pattern that I used previously failed because it produces keys typed as string, and TypeScript won't use a plain string to index a type with specific known keys like `ConjugationForm`. 
The 'keyof` type operator produces union types for the keys of the object that we need to access:

```typescript
for (let key in indicativePresent) {
  expect(within(tables[0]).getByText(
    indicativePresent[key as keyof ConjugationForm]
  )).toBeInTheDocument();
}
```

In this example, `key: "form_1s" | "form_1p" | ...` and so on.

## Header.test.tsx (8 - 13 Jun 2026)

### Problems Found

**React Router attempts to take user to NavLink's destination path when clicked**
Given that the testing environment is a virtual DOM without any of the paths that exist in the actual app, when the `Header` component's `NavLink` elements are clicked during test actions, an error is thrown (caught and handled by React Router, so as not to cause our test to fail):

```console
stderr | src/components/Header/Header.test.tsx > Header > should call reset function if Sign Out Nav Link element is clicked
No routes matched location "/signin" 
Error handled by React Router default ErrorBoundary: ErrorResponseImpl {
  status: 404,
  statusText: 'Not Found',
  internal: true,
  data: 'Error: No route matches URL "/signin"',
  error: Error: No route matches URL "/signin"
```
## Research

**Disabling the module when Vitest is running**
I attempted the approach from [this article](https://akoskm.com/react-router-vitest-example/) (note: video version: <<https://egghead.io/set-up-vitest-browser-mode-in-a-react-router-app~6s7lg>>) to disable React Router while Vitest is running.

The differences in the setup in that demonstration are worth noting; it's a Vite project, rather then CRA, and uses React Router instead of React Router DOM.

The closest I've been able to get to what's demoed is:

```typescript
/// ...
import { RouterProvider } from 'react-router-dom';

export default defineConfig({
  plugins: [react(), !process.env.VITEST && RouterProvider],
  // ...
});
```

This has not resolved the issue and the error persists.

**Using the MemoryRouter API**
`MemoryRouter` is ([according to the component API docs](https://reactrouter.com/6.30.3/router-components/memory-router)) the ideal API for writing tests, and there are a list of examples of it's use [here](https://github.com/remix-run/react-router/tree/main/packages/react-router/__tests__).

This API is best suited to the requirements of this test because it _'stores its locations internally in an array. Unlike <BrowserHistory> and <HashHistory>, it isn't tied to an external source, like the history stack in a browser. This makes it ideal for scenarios where you need complete control over the history stack, like testing.'_
Source: <<https://reactrouter.com/6.30.3/router-components/memory-router>>

It's also useful because it takes `initialEntries` props that alloms any address from the app to be booted up in the virtual DOM.

### Solution

**Add the paths to the RouterProvider**
Though not an elegant solution, simple adding the path itself to the Router array gives React Router enough to work with, and the error goes away.

```typescript
const customHeaderRender = (
  providerProps: AuthContextType,
  user: User,
  renderOptions?: RenderOptions,
) => {
  return render(
    <AuthContext.Provider value={providerProps}>
      <RouterProvider
        router={createBrowserRouter([
          {
            path: '/',
            element: <Header user={user} signOut={providerProps.resetForm} />,
          },
          // maybe toggle this array item with an arg?
          {
            path: '/signin',
            element: <SignIn loadUser={() => {}} />,
          },
        ])}
      />
    </AuthContext.Provider>,
  );
};
```

However, this requires that the appropriate path is added for each test.

**BETTER SOLUTION: use the MemoryRouter API**
Using `MemoryRouter` allows me to keep the render logic lean whilst also eliminating the routing error that occured when performing a click event on a `NavLink` element that would navigate the window to a different path.

```typescript
const customHeaderRender = (
  providerProps: AuthContextType,
  user: User,
  renderOptions?: RenderOptions,
) => {
  return render(
    <AuthContext.Provider value={providerProps}>
      <MemoryRouter initialEntries={['/']}>
        <Header user={user} signOut={testSignOutFn} />
      </MemoryRouter>
    </AuthContext.Provider>,
  );
};
```

**EXTRA: resetting mocked implementations**
I've mocked a `signOut` callback, and my final test in this file asserts whether or not it has been called. 
If there was a subsequent test that made the same assertion, it would pass regardless because it has indeed already been called in this run of tests. This is an example of a 'memory leak'.

In such circumstances (esp when declared in the global scope), mocks and spies should be [reset](https://vitest.dev/guide/learn/mock-functions.html#resetting-mocks):

```typescript
beforeEach(() => {
  testSignOutFn.mockClear();
});
```

## Userform.test.tsx (13 Jun 2026)

### Problems Found

**Cannot assign less specific type to a union**

Some of the `Userform` props union types:

```typescript
function Userform({
  cardTitle,
  // ...
  buttonTitle,
  //...
}: {
  cardTitle: 'Sign Up' | 'Sign In';
  // ...
  buttonTitle: 'Register' | 'Sign In';
  // ...
}) {
  // function body...
}
```

This means that when setting up the props that are used in a test, simply using strings will not work, even thought both aforementioned unions are of string types.

```typescript
const userformProps = {
  cardTitle: 'Sign In',
  //...
  buttonTitle: 'Sign In',
  //...
};
```

...produces the error:

```console
Type 'string' is not assignable to type '"Sign In" | "Sign Up"'.
```

## Solution

**Constant Types prevent type widening**
By using `as const` the property type is set to the specific value assigned, instead of being widened.

```typescript
const userformProps = {
  cardTitle: 'Sign In' as const,
  //...
  buttonTitle: 'Sign In' as const,
  //...
};
```

Now `cardTitle` and `buttonTitle` are *Constant Types* properties and are each typed `'Sign In'` instead of `string`, and therefore satisfy the constrainst of the union types.
