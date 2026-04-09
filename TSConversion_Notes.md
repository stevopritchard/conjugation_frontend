# Conversion Progress

- [x] auth-context.tsx - First pass complete
  - [x] Refactor body building (remove unnecessary initialization)
  - [ ] Add validation helper function (email/password format)
  - [ ] Ensure validation exists server-side (check backend routes)
- [x] conjugation-context.tsx
  - [x] Extract conjugation types to src/types/conjugation.ts
  - [x] Create helper functions for empty conjugation forms
  - [x] Refactor default conjugation value to use helpers
  - [ ] Investigate timing dependency in searchVerbs - why does awaiting listFavourites cause sticky searches?
  - [ ] Consider refactoring searchVerbs to be properly async
- [x] quiz-reducer.jsx
- [x] Conjugation.jsx
- [x] Header.js
- [x] RootLayout.jsx
- [x] Question.jsx
- [x] Register.jsx / Signin.jsx / Userform.jsx
- [x] VerbTable.jsx
- [x] RootLayout.jsx
- [x] Reference.jsx
- [x] Practise.jsx
- [x] App.js

# Outstanding TODOs

## auth-context.tsx
- [x] Create proper `User` type instead of `{}`
- [ ] Review whether `Record<string, string>` for `body` is appropriate
- [x] Apply User type consistently once created

## conjugation-context.tsx
- [ ] ...


# TypeScript Conversion Notes

## Key Patterns Learned
- Discriminated unions for reducer actions
- Type guards with `instanceof`
- `as const` for literal types
- Helper functions for DRY object initialization
- `satisfies` for type-checked constants
- Empty array vs empty object initialization
- Shared types in dedicated files

## Common Issues & Solutions
- `.ts` vs `.tsx` - use `.tsx` for JSX
- `never[]` inference - annotate empty arrays
- `unknown` in catch blocks - use type guards
- Async function signatures - return `Promise<void>`

## auth-context.tsx - [Feb 10, 2026]

### Problems Found

1. 

```console
  ERROR in src/store/auth-context.tsx:57:7
  TS7053: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{ register: { endpoint: string; fields: string[]; errorMessage: string; }; signin: { endpoint: string; fields: string[]; errorMessage: string; }; }'.
    No index signature with a parameter of type 'string' was found on type '{ register: { endpoint: string; fields: string[]; errorMessage: string; }; signin: { endpoint: string; fields: string[]; errorMessage: string; }; }'.
      55 |   ) {
      56 |     const config: { endpoint: string; fields: string[]; errorMessage: string } =
    > 57 |       authConfig[type];
        |       ^^^^^^^^^^^^^^^^
      58 |     const body = {};
      59 |     config.fields.forEach((field) => {
      60 |       body[field] = formInputData[field];
```

2. 

```console
  ERROR in src/store/auth-context.tsx:60:21
  TS7053: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{ name: string; email: string; password: string; }'.
    No index signature with a parameter of type 'string' was found on type '{ name: string; email: string; password: string; }'.
      58 |     const body = {};
      59 |     config.fields.forEach((field) => {
    > 60 |       body[field] = formInputData[field];
        |                     ^^^^^^^^^^^^^^^^^^^^
      61 |     });
      62 |     const errorType = config.errorMessage;
      63 |     fetch(`http://localhost:3001/api/auth${config.endpoint}`, {
```

3. 

```console
  ERROR in src/store/auth-context.tsx:121:27
  TS2322: Type '{ formInputData: { name: string; email: string; password: string; }; responseText: string; setResponseText: Dispatch<SetStateAction<string>>; loading: boolean; setLoading: Dispatch<...>; handleInputChange: (fieldName: string) => (event: React.ChangeEvent<HTMLInputElement>) => void; submitForm: (type: string, loadUse...' is not assignable to type '{ formInputData: {}; responseText: StringConstructor; setResponseText: () => void; loading: BooleanConstructor; setLoading: () => void; handleInputChange: () => void; submitForm: () => void; resetForm: () => void; }'.
    Types of property 'responseText' are incompatible.
      Type 'string' is not assignable to type 'StringConstructor'.
      119 |   };
      120 |   return (
    > 121 |     <AuthContext.Provider value={authContextValue}>
          |                           ^^^^^
      122 |       {children}
      123 |     </AuthContext.Provider>
      124 |   );
```

### Questions

- I have not yet been able to solve **Question #3**. I read an example on the [official React docs](https://react.dev/learn/typescript#typing-usecontext) and attempted to create an `AuthContextType` type that would fix the mismatch with the inferred type of AuthContext:

```typescript
type AuthContextType = {
  formInputData: FormInputDataType;
  responseText: string;
  setResponseText: Dispatch<
    SetStateAction<{
      name: string;
      email: string;
      password: string;
    }>
  >;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  handleInputChange: () => void;
  submitForm: () => void;
  resetForm: () => void;
};
```

However this leads to further errors:

```console
ERROR in src/store/auth-context.tsx:33:17
TS2322: Type 'StringConstructor' is not assignable to type 'string'.
    31 | export const AuthContext = createContext<AuthContextType>({
    32 |   formInputData: {},
  > 33 |   responseText: String,
       |                 ^^^^^^
    34 |   setResponseText: () => {},
    35 |   loading: Boolean,
    36 |   setLoading: () => {},

ERROR in src/store/auth-context.tsx:35:12
TS2322: Type 'BooleanConstructor' is not assignable to type 'boolean'.
    33 |   responseText: String,
    34 |   setResponseText: () => {},
  > 35 |   loading: Boolean,
       |            ^^^^^^^
    36 |   setLoading: () => {},
    37 |   handleInputChange: () => {},
    38 |   submitForm: () => {},

ERROR in src/store/auth-context.tsx:147:27
TS2322: Type '{ formInputData: FormInputDataType; responseText: string; setResponseText: Dispatch<SetStateAction<string>>; loading: boolean; setLoading: Dispatch<...>; handleInputChange: (fieldName: string) => (event: React.ChangeEvent<HTMLInputElement>) => void; submitForm: (formType: "register" | "signin", loadUser: (user: {}) ...' is not assignable to type 'AuthContextType'.
  Types of property 'setResponseText' are incompatible.
    Type 'Dispatch<SetStateAction<string>>' is not assignable to type 'Dispatch<SetStateAction<{ name: string; email: string; password: string; }>>'.
      Type 'SetStateAction<{ name: string; email: string; password: string; }>' is not assignable to type 'SetStateAction<string>'.
        Type '{ name: string; email: string; password: string; }' is not assignable to type 'SetStateAction<string>'.
    145 |   };
    146 |   return (
  > 147 |     <AuthContext.Provider value={authContextValue}>
        |                           ^^^^^
    148 |       {children}
    149 |     </AuthContext.Provider>
    150 |   );

```

Substituting the object declaration for type declaration for `AuthContext` also leads to errors:

```console
ERROR in src/store/auth-context.tsx:138:18
TS2339: Property 'Provider' does not exist on type '(defaultValue: AuthContextType) => Context<AuthContextType>'.
    136 |   };
    137 |   return (
  > 138 |     <AuthContext.Provider value={authContextValue}>
        |                  ^^^^^^^^
    139 |       {children}
    140 |     </AuthContext.Provider>
    141 |   );

ERROR in src/store/auth-context.tsx:140:19
TS2339: Property 'Provider' does not exist on type '(defaultValue: AuthContextType) => Context<AuthContextType>'.
    138 |     <AuthContext.Provider value={authContextValue}>
    139 |       {children}
  > 140 |     </AuthContext.Provider>
        |                   ^^^^^^^^
    141 |   );
    142 | }
    143 |

```

### Decisions

In order referencing **Problems Found** section:

1. assigned a Record type to `authConfig` which referenced an interface for its properties:

  ```typescript
  // interface declared outside of context
  interface authConfigType {
    endpoint: string,
    fields: string[],
    errorMessage: string
  }

  // inside context

  const authConfig: Record<string, authConfigType>
  ```

2. assigned `FormInputDataType` to `formInputData`:

  ```typescript
  type FormInputDataType = {
    [prop: string]: string;
  }

  // inside context

  const [formInputData, setFormInputData] = useState<FormInputDataType>({
    name: '',
    email: '',
    password: '',
  });
  ```

### Blockers

- None yet

### Notes

- 


## auth-context.tsx - [Feb 11, 2026]

### Problems Found

Item #3 from yesterday: 

```console
  ERROR in src/store/auth-context.tsx:121:27
  TS2322: Type '{ formInputData: { name: string; email: string; password: string; }; responseText: string; setResponseText: Dispatch<SetStateAction<string>>; loading: boolean; setLoading: Dispatch<...>; handleInputChange: (fieldName: string) => (event: React.ChangeEvent<HTMLInputElement>) => void; submitForm: (type: string, loadUse...' is not assignable to type '{ formInputData: {}; responseText: StringConstructor; setResponseText: () => void; loading: BooleanConstructor; setLoading: () => void; handleInputChange: () => void; submitForm: () => void; resetForm: () => void; }'.
    Types of property 'responseText' are incompatible.
      Type 'string' is not assignable to type 'StringConstructor'.
      119 |   };
      120 |   return (
    > 121 |     <AuthContext.Provider value={authContextValue}>
          |                           ^^^^^
      122 |       {children}
      123 |     </AuthContext.Provider>
      124 |   );
```

### Questions

- 

### Decisions

In order referencing **Problems Found** section:

1. assigned a Record type to `authConfig` which referenced an interface for its properties:

  ```typescript
    type AuthContextType = {
      formInputData: FormInputDataType;
      responseText: string;
      setResponseText: Dispatch<SetStateAction<string>>;
      loading: boolean;
      setLoading: Dispatch<SetStateAction<boolean>>;
      handleInputChange: (fieldName: string) => void;
      submitForm: (
        formType: 'register' | 'signin',
        loadUser: (user: {}) => void,
        navigate: NavigateFunction
      ) => void;
      resetForm: () => void;
    };

    export const AuthContext = createContext<AuthContextType>({
      formInputData: {},
      responseText: '',
      setResponseText: () => {},
      loading: false,
      setLoading: () => {},
      handleInputChange: () => {},
      submitForm: () => {},
      resetForm: () => {},
    });
  ```

### Blockers

- 

### Notes

- 


## auth-context.tsx - [Feb 16, 2026]

### Problems Found

**Feedback from Claude**:
- `Record<string, authConfigType>` is too loose a definition for the object passed to `submitForm`, as the function should only accept one of two possible config objects. `as const` is already used to narrow the permissable array value for the `field` property on that object, and this is also a suitable solution for the entire object. This also means that the `AuthConfigType` interface is not required:

```typescript
  const authConfig = {
    register: {
      endpoint: '/register',
      fields: ['name', 'email', 'password'] as const,
      errorMessage: 'Registration',
    },
    signin: {
      endpoint: '/signin',
      fields: ['email', 'password'] as const,
      errorMessage: 'Sign in',
    },
  } as const;
```
  - by using this pattern, we restrict which objects can be passed as the body of our request submitted by `submitForm` AND enable the TypeScript compiler to flag an error if an invalid key is passed, such as `authConfig['signout']`.

- a mistake that I used in a practise project carrried over, because I used said project for reference instantiating `createContext`:

```javascript
  responseText: String,
  loading: Boolean,
```
  - the solution is straightforward; pass default values instead of Constructors:

```javascript
  responseText: '',
  loading: false,
```

### Research

- Read over [const assertions in the official TypeScript documentation](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions). This helps to clarify the use-case, as well as limitations (for example, it's not suitable for entire expressions that calculate a value)

### Solution

- I've amended my code as per Claude's recommendation.

### Key Learning

- 'const assertion' is suitable when we want literal types to be declared with the most narrow definition possible.
- `string` (lowercase) is the TypeScript type, `String` (capital) is the 
  JavaScript constructor. Always use lowercase primitives in TypeScript: 
  string, number, boolean

### Open Questions

- I'm still fuzzy on what benefit `readonly` confers to an assignment. Is it simply to indicate that a specific, static value is permitted instead of a type?
- using as const sets the entire config object as readonly. In doing so, we ensure that not only the designated properties are available to be referenced by square brackets notation (and the TypeScript will catch any attempt to access a different property at compilation), but that the properties of those config types (‘register’ and ‘signing’ ) cannot be mutated after declaration, further reducing the scope for bugs as these objects are passed to functions

## conjugation-context.tsx - [Feb 17-18, 2026]

### Problems Found

**Errors flagged in console on change of file extension from .jsx to .tsx:**
1.  ```console
      Binding element 'children' implicitly has an 'any' type.
      > 17 | export default function ConjugationContextProvider({ children }) 
    ```

2.  ```console
      Parameter 'id' implicitly has an 'any' type.
      > 46 |   const listFavourites = useCallback(async function listFavourites(id) {})
    ```

3.  ```console
      Parameter 'infinitive' implicitly has an 'any' type.
      68 |       setFavourites(favoriteInfinitives);
      69 |
      > 70 |       const verbPromises = favoriteInfinitives.map((infinitive) =>
    ```

4.  ```console
      Argument of type 'any[]' is not assignable to parameter of type 'SetStateAction<never[]>'.
      Type 'any[]' is not assignable to type 'never[]'.
        Type 'any' is not assignable to type 'never'.
        77 |
        78 |       const verbs = await Promise.all(verbPromises);
      > 79 |       setFilteredVerbs(verbs);
    ```

5.  ```console
      'err' is of type 'unknown'.
        79 |       setFilteredVerbs(verbs);
        80 |     } catch (err) {
      > 81 |       console.error(err.message);
    ```

6.  ```console
      Parameter 'id' implicitly has an 'any' type.
        85 |   }, []);
        86 |
      > 87 |   function searchVerbs(id) {
    ```

7.  ```console
      Parameter 'selection' implicitly has an 'any' type.
        115 |   }
        116 |
      > 117 |   function verbSelection(selection, verb) {
    ```

8.  ```console
      Parameter 'verb' implicitly has an 'any' type.
        115 |   }
        116 |
      > 117 |   function verbSelection(selection, verb) {
    ```

9.  ```console
      Object literal may only specify known properties, and 'gerund_english' does not exist in type 'SetStateAction<{ infinitive: string; gerund: string; past_participle: string; indicative_present: never[]; indicative_presentperfect: never[]; indicative_preterite: never[]; indicative_imperfect: never[]; ... 12 more ...; subjunctive_futureperfect: never[]; }>'.
        141 |             infinitive: verb,
        142 |             gerund: conjugatedVerb.gerund,
      > 143 |             gerund_english: conjugatedVerb.gerund_english,
    ```

10.  ```console
      Parameter 'verb' implicitly has an 'any' type.
        174 |   }
        175 |
      > 176 |   async function addFavourite(verb, id) {
    ```

11.  ```console
      Parameter 'id' implicitly has an 'any' type.
        174 |   }
        175 |
      > 176 |   async function addFavourite(verb, id) {
    ```

12.  ```console
      Parameter 'verb' implicitly has an 'any' type.
        190 |   }
        191 |
      > 192 |   async function removeFavourite(verb, id) {
    ```

13.  ```console
      Parameter 'id' implicitly has an 'any' type.
        190 |   }
        191 |
      > 192 |   async function removeFavourite(verb, id) {
    ```

14.  ```console
      'err' is of type 'unknown'.
        205 |       await listFavourites(id); // Reload favorites
        206 |     } catch (err) {
      > 207 |       setResponseText(err.message);
    ```

15.  ```console
      Type '{ setSearchfield: Dispatch<SetStateAction<string>>; favourites: never[]; filteredVerbs: never[]; verbSelected: boolean; conjugation: { infinitive: string; gerund: string; ... 17 more ...; subjunctive_futureperfect: never[]; }; ... 5 more ...; removeFavourite: (verb: any, id: any) => Promise<...>; }' is not assignable to type '{ setSearchfield: () => void; favourites: never[]; filteredVerbs: never[]; verbSelected: BooleanConstructor; conjugation: {}; responseText: StringConstructor; ... 4 more ...; removeFavourite: () => void; }'.
      Types of property 'setSearchfield' are incompatible.
        Type 'Dispatch<SetStateAction<string>>' is not assignable to type '() => void'.
          Target signature provides too few arguments. Expected 1 or more, but got 0.
        223 |   };
        224 |   return (
      > 225 |     <ConjugationContext.Provider value={conjugationContextValue}>
    ```
### Research

**Pertaining to issues numbered in order listed in 'Problems Found':**
4. While I have found various explanations of the `never` type and how  functions that never return anything can be inferred to have that type, I could not find much on the `never[]` type.
From [this blog post](https://dbiswas.com/blog/typescript-never-array/) I gleamed upon an explanation that the author has put together. They suggest that `never` is assigned as the type because it is assignable to anything and since this project is in strict mode implicit `any` types are avoided. Therefore `never` is the best fit because we:

  > "need it to be a type which is assignable to any other type. Our only option, then, is for the empty array to be inferred as never[]"

This is the most that I've been able to deduce on why this problem occurs.

### Solution

**In order listed in 'Problems Found':**
1. Assigned the `React.JSX.Element` because child is a React component:
  ```typescript 
    export default function ConjugationContextProvider({ children }: {children: React.JSX.Element})
  ```
2. Assigned type `string` to `id`. Depsite the ID reference being numeric, it's saved as a string like all other data from the PostGreSQL database.

3. `favoriteInfinitives` will return an array of strings or an empty array. Therefore if there are any `infinitive` items to map, they will be strings.

4. TypeScript has inferred that `Dispatch<SetStateAction<never[]>>` so I have assigned a type `favouriteVerbType[]` to 'filteredVerbs' that matches the shape of the objects that will make up the array.
  ```typescript 
    type favouriteVerbType = {
      infinitive: string;
      infinitive_english: string;
    }
    //..
    const [filteredVerbs, setFilteredVerbs] = useState<favouriteVerbType[]>([]);
  ```
As an extra precaution, I have explicitely assigned a type to `verbs`:
  ```typescript 
    const verbs: favouriteVerbType[] = await Promise.all(verbPromises);
  ```

5. **stuck here** have not found a source or any documentation about how to type fetch errors. `unknown` is not allowed in strict mode.

6. `id` will be a string type

7. `selection` is type `boolean`.

8. `verb` is type `string`.

9. I had omitted a default value for the `gerund_english` property when declaring the default value for conjugation.

10. `verb` is type `string`.

11. `id` is type `string`.

12. `verb` is type `string`.

13. `id` is type `string`.

14. Stuck, as with #5

15. As I learned with auth-context.tsx, a custom type can clarify the mismatched inferences:
 ```typescript 
    type ConjugationContextType = {
      setSearchfield: Dispatch<SetStateAction<string>>;
      favourites: string[];
      filteredVerbs: favouriteVerbType[];
      verbSelected: boolean;
      conjugation: ConjugationType;
      responseText: string;
      listFavourites: (id: string) => void;
      searchVerbs: (id: string) => void;
      verbSelection: (selection: boolean, verb: string) => void;
      addFavourite: (verb: string, id: string) => void;
      removeFavourite: (verb: string, id: string) => void;
    };
  ```

### Key Learning

- There is a hierarchy of types in TypeScript
- The .tsx file must have the relevant functions and objects imported from their respective libraries in order to discern their types. I think it prompts tsc to access the appropriate type definition file. This occured automatically in auth-context and I didn't notice.

**Update (Mar 04):** See notes from Mar 2 for deeper explanation of why empty arrays work with type annotation vs why empty objects don't. The key distinction: arrays can start empty and have items added; objects with required properties must have all properties at initialization.

### Open Questions

- How do I handle the inference of the `unknown` type to error objects passed to `catch` blocks? Is there a method to do this that's specific to the fetch API? Do I only need to type the property of the object that access in the statement body?

## conjugation-context.tsx - [Feb 19, 2026]

### Problems Found

- **Issues outstanding from yesterday:**
5.  ```console
      'err' is of type 'unknown'.
        79 |       setFilteredVerbs(verbs);
        80 |     } catch (err) {
      > 81 |       console.error(err.message);
    ```

14.  ```console
      'err' is of type 'unknown'.
        205 |       await listFavourites(id); // Reload favorites
        206 |     } catch (err) {
      > 207 |       setResponseText(err.message);
    ```

- **Async function signatures**
  Async signatures do not match the corresponding function definitions
  ```typescript
    export const ConjugationContext = createContext<ConjugationContextType>({
      listFavourites: () => {},
      searchVerbs: () => {},
      verbSelection: () => {},
      addFavourite: () => {},
      removeFavourite: () => {},
    })
  ```
See **Solution** for further info.
### Research

- Discussion with Claude

### Solution

- Used type guards to check that the value is an instance of a class (which would have the property that we want to access).
5.  ```typescript
    catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.log(`An unexpected error occured: ${err}`);
      }
    }
    ```

14. ```typescript
    catch (err) {
      if (err instanceof Error) {
        setResponseText(err.message);
      } else {
        setResponseText(`An unexpected error occured: ${err}`);
      }
    }
    ```

- **Async function signatures**
Both sets of signatures (`ConjugationContextType` and `ConjugationContext`) have been fixed to address the aforementioned issue:
  ```typescript
  type ConjugationContextType = {
    //...
    listFavourites: (id: string) => Promise<void>;
    searchVerbs: (id: string) => Promise<void>;
    verbSelection: (selection: boolean, verb: string) => void;
    addFavourite: (verb: string, id: string) => Promise<void>;
    removeFavourite: (verb: string, id: string) => Promise<void>;
  };

  //...
  export const ConjugationContext = createContext<ConjugationContextType>({
    listFavourites: (_id: string) => Promise.resolve(),
    searchVerbs: async (_id: string) => {},
    verbSelection: (_selection: boolean, _verb: string) => {},
    addFavourite: async (_verb: string, _id: string) => {},
    removeFavourite: async (_verb: string, _id: string) => {},
  })
  ```
Refer to **Key Learning** for explanation of patterns

### Key Learning

- `instanceof` creates type guards by checking if a value is an instance of a specific class (like Error), allowing TypeScript to narrow the type and safely access class-specific properties/methods.

- #### Async vs Promise Chain Pattern

  **Async function (returns Promise):**
  ```typescript
    async function foo() {
      await fetch(...);
      setState(...);
    }
    // Type: () => Promise<void>
    // Caller can await this
  ```

  **Promise chain (returns void):**
  ```typescript
    function foo() {
      fetch(...).then(...);
      setState(...);
    }
    // Type: () => void
    // Returns immediately, Promise handled internally
  ```

  **When to use which:**
  - Use async when caller needs to wait for completion
  - Use Promise chain when fire-and-forget is acceptable

## auth-context.tsx - [Feb 26, 2026]

### Problems Found

- **Insufficient type safety**
  I assigned a generic type to `body` - the variable passed to the fetch api call - simply as a means to dismiss an error due to TypeScript inferring an `unknown` type:
  ```typescript
    const body: Record<string, string> = {};
  ```
  However this offers no type safety.

### Research

- 

### Solution

My solution was to define types for the two object shapes that I want to pass to the request body:

```typescript
type RegisterBody = {
  name: string;
  email: string;
  password: string;
}

type SignInBody = {
  email: string;
  password: string;
}
```

Then assign a union of those 2 types to `body`:

```typescript
const body: RegisterBody | SignInBody = {
  name: '',
  email: '',
  password: '',
};
```

In hindsight, I could have been more thorough with this approach; I could have used a type gaurd, for example.
However, Claude ultimately recommended constructing the `body` object directly from the available properties determined by the function argument:

```typescript
const body = config.fields.reduce((acc, field) => {
  acc[field] = formInputData[field];
  return acc;
}, {} as Record<string, string>);
```

Makes sense, however it does highlight inexperience on my part in understanding the best approach in the context of appropriate type security.

### Key Learning

- Pre-initializing objects with placeholder values isn't always necessary. Sometimes building the object dynamically from known data is cleaner and just as type-safe. 
(note that a generic was still used in this solution because the `.reduce()` array method must have a default value to start with).

  ## Common Patterns Reference

  ### Dynamic Object Building

  **When you need to build an object from dynamic keys:**
  ```typescript
  // Option 1: reduce
  const obj = keys.reduce((acc, key) => {
    acc[key] = data[key];
    return acc;
  }, {} as Record);

  // Option 2: Object.fromEntries
  const obj = Object.fromEntries(
    keys.map(key => [key, data[key]])
  );

  // Option 3: Direct assignment (when keys are known)
  const obj = {
    key1: data.key1,
    key2: data.key2,
  };
  ```

  **Use reduce when:** Building complex accumulation  
  **Use fromEntries when:** Simple key-value mapping  
  **Use direct assignment when:** Keys are fixed and known

### Open Questions

- 

## quiz-reducer.tsx - [Feb 26 - 27, 2026]

### Problems Found

- **Errors raised on file type conversion:**
  ```console
    ERROR in src/store/quiz-reducer.tsx:1:37
    TS7006: Parameter 'state' implicitly has an 'any' type.
      > 1 | export default function quizReducer(state, action) {
          |                                     ^^^^^
        2 |   switch (action.type) {
        3 |     case 'SET_QUIZ_LENGTH':
        4 |       return {

    ERROR in src/store/quiz-reducer.tsx:1:44
    TS7006: Parameter 'action' implicitly has an 'any' type.
      > 1 | export default function quizReducer(state, action) {
          |                                            ^^^^^^
        2 |   switch (action.type) {
        3 |     case 'SET_QUIZ_LENGTH':
        4 |       return {

    ERROR in src/store/quiz-reducer.tsx:19:14
    TS7006: Parameter 'tense' implicitly has an 'any' type.
        17 |           ...state,
        18 |           selectedTenses: state.selectedTenses.filter(
      > 19 |             (tense) => tense !== action.payload.id
          |              ^^^^^
        20 |           ),
        21 |         };
        22 |       }
  ```

### Research

- First attempt: [This article](https://dev.to/craigaholliday/using-the-usereducer-hook-in-react-with-typescript-27m1) outlines a clear pattern for typing useReducer arguments.

- Second attempt, 27 Feb: After consultation with Claude, I started to investigate discriminated unions but found the [first article that I read](https://dev.to/maikelev/discriminated-unions-in-typescript-5fia) to be too expansive for what I needed to do. A [playground demo on the official TypeScript site](https://www.typescriptlang.org/play/typescript/meta-types/discriminate-types.ts.html) offered a surprisingly succint explanation by way of commented code, which I used in my solution.

### Solution

- My first attempt:
```typescript
  enum QuizActionKind {
    SET_QUIZ_LENGTH = 'SET_QUIZ_LENGTH',
    SELECT_TENSES = 'SELECT_TENSES',
    START_TEST = 'START_TEST',
    UPDATE_SCORE = 'UPDATE_SCORE',
    NEXT_QUESTION = 'NEXT_QUESTION',
    STOP_TEST = 'STOP_TEST',
  }

  interface QuizActionPayload {
    checked?: boolean;
    id?: string;
  }

  interface QuizAction {
    type: QuizActionKind;
    payload: string | number | QuizActionPayload;
  }

  interface QuizReducerState {
    isActive: boolean;
    currentQuestion: number;
    totalQuestions: number;
    selectedTenses: string[];
    score: number;
    prevQuizLength: number;
  }

  export default function quizReducer(
    state: QuizReducerState,
    action: QuizAction
  ) {
    //...
  }
```
This is not a working solution. My attempt to assign types to the nested properties on `payload` does not work.

- My second attempt:
```typescript
  enum QuizActionKind {
    SET_QUIZ_LENGTH = 'SET_QUIZ_LENGTH',
    SELECT_TENSES = 'SELECT_TENSES',
    START_TEST = 'START_TEST',
    UPDATE_SCORE = 'UPDATE_SCORE',
    NEXT_QUESTION = 'NEXT_QUESTION',
    STOP_TEST = 'STOP_TEST',
  }

  type SetQuizLengthAction = {
    type: 'SET_QUIZ_LENGTH';
    payload: number;
  };

  type SelectTensesAction = {
    type: 'SELECT_TENSES';
    payload: {
      checked: boolean;
      id: string;
    };
  };

  type StartTestAction = {
    type: 'START_TEST';
  };

  type UpdateScoreAction = {
    type: 'UPDATE_SCORE';
    payload: number;
  };

  type NextQuestionAction = {
    type: 'NEXT_QUESTION';
  };

  type StopTestAction = {
    type: 'STOP_TEST';
  };

  type QuizAction =
    | SetQuizLengthAction
    | SelectTensesAction
    | StartTestAction
    | UpdateScoreAction
    | NextQuestionAction
    | StopTestAction;

  interface QuizReducerState {
    isActive: boolean;
    currentQuestion: number;
    totalQuestions: number;
    selectedTenses: string[];
    score: number;
    prevQuizLength: number;
  }

  export default function quizReducer(
    state: QuizReducerState,
    action: QuizAction
  ) { //...
  }
```
This solution works!  However, I would like to try and refine this. Defining a separate type for each action seems unwieldy and I would like to see if I can condense these type declarations.

### Key Learning

#### Type vs Interface for Reducer Actions

**Use `type` for discriminated unions:**
```typescript
type Action = ActionA | ActionB | ActionC;  // ✅ Only types can do this
```

**Interfaces cannot represent unions.** Since reducer actions are unions of individual action types, use `type` throughout for consistency.

**General rule:**
- `type` for unions, intersections, primitives, functions
- `interface` for object shapes that need extension or class contracts

**Modern TypeScript convention:** Default to `type` unless you specifically need `interface` features.

### Open Questions

- 

## Header.tsx - [Mar 02, 2026]

### Problems Found

- After `auth-context.tsx`, `Header.tsx` is the second file to consumer (or declare a function that consumes) the `user` object declared in App.js, therefore it would be beneficial to move the type delcaration for the user so that it can be imported as required.

### Research

### Solution

- Simply create a folder (`src/types`), create a `user.ts` file, and export the `User` type from that file. This single declaration removes the need to declare it in the files where the user object is consumed.


### Key Learning

- Types can be exported and imported like JavaScript modules using ES6 syntax (`export type` / `import type`)
- Note that `export type` et al are TypeScript specific syntax and exists only at compile time - not included in the final JavaScript output (unlike ES6 `export function` or `export const`).
- when importing, can use `import type` syntax to denote that an import is for a type (not required)
  **Example:**
  ```typescript
  // types/user.ts
  export type User = { id: string; name: string };

  // Header.tsx
  import type { User } from '../../types/user';
  ```


### Open Questions

- 

## conjugation-context.tsx (facilitating the conversion of VerbTable.jsx) - [Mar 04, 2026]

### Problems Found

- `VerbTable.tsx` accesses properties on the `conjugation` object that it recieves from `conjugation-context.tsx`.
- In my prior conversion of `conjugation-context.tsx` I had not set these properties on the initial context value or the initial value for the `conjugation` state object that accesses this context value.
- After creating `ConjugationType` I created objects (of the same shape as that type) as the initial values of the context value and state object, however these delcarations are long, unwieldy, error-prone, and repeated in the code.
  ```typescript
  conjugation: {
    infinitive: '',
    gerund: '',
    gerund_english: '',
    past_participle: '',
    past_participle_english: '',
    indicative_present: {
      form_1s: '',
      form_1p: '',
      form_2s: '',
      form_2p: '',
      form_3s: '',
      form_3p: '',
    },
    indicative_presentperfect: {
      form_1s: '',
      form_1p: '',
      form_2s: '',
      form_2p: '',
      form_3s: '',
      form_3p: '',
    },
    // repeat for every tense (imperative tenses vary slightly)...
  }
  ```

### Research

- 

### Solution

- create a `conjugation.ts` type file that exports helper functions that return an object that safisfies the property types for the tenses in `ConjugationType` (also moved to this file):

`conjugation.ts`
```typescript
export type ConjugationType = {
  //...
  indicative_present: ConjugationForm;
  indicative_presentperfect: ConjugationForm;
  //...
};

export function createEmptyConjugationForm(): ConjugationForm {
  return {
    form_1s: '',
    form_1p: '',
    form_2s: '',
    form_2p: '',
    form_3s: '',
    form_3p: '',
  };
}
```
`conjugation-context.tsx`
```typescript
const INITIAL_CONJUGATION = {
  // ...
  indicative_present: createEmptyConjugationForm(),
  indicative_presentperfect: createEmptyConjugationForm(),
}
```

### Key Learning

I was unclear on why an empty array is an accepted value where the value returned from `useState` is annotated:

```typescript
useState<favouriteVerbType[]>([])
```

This ties back to my notes from 17 - 18 Feb; we have to tell TypeScript to expect aray values if the array will receive them, but array can be empty, initially.

However with objects, all required properties must exist at initialization, even if their values will change later.

#### useState Type Annotation vs Inference

**Empty collections need explicit types:**
```typescript
const [items, setItems] = useState([]);
// Empty array gives no clues - must tell TypeScript what it will hold
```

**Full objects can use inference:**
```typescript
const INITIAL = { prop: '' } satisfies MyType;
const [state, setState] = useState(INITIAL);
// TypeScript infers from the object structure
```

**Why empty arrays work with type annotation:**
- `[]` is compatible with ANY array type
- Generic parameter tells TypeScript what the array will hold LATER
- TypeScript only checks: "Is initial value compatible?" (YES for `[]`)

**Why empty objects DON'T work:**
- `{}` is NOT compatible with types that require specific properties
- Missing required properties = type error


### Open Questions

- 

## Userform.tsx - [Mar 12, 2026]

### Problems Found

#### Converting component to a function
- I had left Userform.jsx as a class-based component after refactoring it, but have decided to convert it to a function component today ahead of converting it to TypeScript. The reason for this is that I want to focus on TypeScript patterns for function components and use this project as an opportunity to get comfortable with them before looking at applying TypeScript to legacy component types. Besides, I have converted all of the other components to functions, so this class was a holdover that I should have dealt with.

#### TypeScript conversion
- I have defined a `FormGroupType` to assign as the type of the `formGroup` prop received by `Userform`:
  ```typescript
  type FormGroupType = {
    controlId: 'formBasicEmail';
    type: 'text' | 'email' | 'password';
    placeholder: string;
    onChange: (fieldName: string) => void;
    value: string;
  };
  // ...
  function Userform({
    cardTitle,
    formGroup,
    onSubmitFunction,
    responseText,
    routeChangeFunction,
    buttonTitle,
  }: {
    cardTitle: string;
    formGroup: FormGroupType[];
    onSubmitFunction: () => void;
    responseText: string;
    routeChangeFunction: NavigateFunction;
    buttonTitle: 'Register' | 'Sign-in';
  })
  ```
  The `onChange` prop is the `handleInputChange()` function declared in `auth-context.tsx`, and is of type `(fieldName: string) => void` *however* when assigning this as the type, a type error occurs:
  
  ```console
  Type '(fieldName: string) => void' is not assignable to type 'ChangeEventHandler<FormControlElement>'.
  ```
  To remedy this, I switched the type to `onChange: ChangeEventHandler<FormControlElement>` but VSCode's Intellisense cannot readily identify where this type comes from. 
  So I sought out the type `FormControlElement` and found the type definition file (via Intellisense; I wrote an import statement for that type) and did indeed find an onChange prop with that type:
  ```typescript
  export interface FormControlProps extends BsPrefixProps {
      bsCustomPrefix?: string;
      htmlSize?: number;
      size?: 'sm' | 'lg';
      plaintext?: boolean;
      readOnly?: boolean;
      disabled?: boolean;
      value?: string | string[] | number;
      onChange?: React.ChangeEventHandler<FormControlElement>;
      custom?: boolean;
      type?: string;
      id?: string;
      isValid?: boolean;
      isInvalid?: boolean;
  }
  ```
  However, I cannot access the `onChange` property on this interface via either dot or square bracket notation.
  
#### Unused routes() function
- ```javascript
  function routes(props) {
      if (props) {
          return (
              <Form.Text onClick = {() => props('register')} className="text-muted">
                  Register
              </Form.Text>
          )
      }
  }
  ```
  A holdover from the refactored app that is no longer being used.

### Research

- 

### Solution

#### TypeScript conversion
- Since `FormControlElement` is not imported from the type definition file, I instead decided to look at the definition of the type itself.
It is defined as `FormControlElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;` and I know that Userform only deals with input elements, so I have decided to define `onChange` as `onChange: React.ChangeEventHandler<HTMLInputElement>;`.

#### Unused routes() function
- Routing is now handled by `react-router-dom`, I have decided to go with Claude's recommendation of an inline expression so that I can use the `useNavigate` hook (which can only be used inside of a function component).

  ```javascript
  {routeChangeProps && (
    <Form.Text
      onClick={() => navigate('/register')}
      className="text-muted"
    >
      Register
    </Form.Text>
  )}
  ```

### Key Learning

**React Event Handler Types:**
- `React.ChangeEventHandler<T>` is shorthand for `(event: React.ChangeEvent<T>) => void`
- For input elements: `React.ChangeEventHandler<HTMLInputElement>`
- This is what React Bootstrap components expect for `onChange` props

**Finding the Right Type:**
- Check React Bootstrap type definitions (Intellisense helps)
- Union types like `FormControlElement` can be narrowed to specific types
- Use the most specific type that matches your use case

**Curried Functions in Context:**
- `handleInputChange` returns a function: `(fieldName) => (event) => void`
- When passing to props, you call the outer function: `onChange={handleInputChange('email')}`
- The returned function matches `React.ChangeEventHandler<HTMLInputElement>`

**Common Pattern:**
```typescript
// In context (curried)
handleInputChange: (fieldName: string) => React.ChangeEventHandler

// When called (returns event handler)
onChange={handleInputChange('email')}
```

### Open Questions

- 

## Userform.tsx - [Mar 16, 2026]

### Problems Found

#### Setting a specific string to `routeChangeProps` makes no sense

- I'm only going to set `routeChangeProps` in the **SignIn** component, yet I'm setting the value as a string ('register') and checking that the variable (not the specific value) exists in Userform:
  ```typescript
  {routeChangeProps && (
    <Form.Text onClick={() => navigate('/register')} className="text-muted">
      Register
    </Form.Text>
  )}
  ```

#### Userform is coupled to React Router

- more of a design choice than a problem, but it might be worth uncoupling Userform from `react-router-dom` in case want to test it without a Router wrapper

### Research

- 

### Solution

#### Change `routeChangeProp` to `registerLink`

- Variable is now a Boolean, and so the existing check better fits the type and purpose:

  ```typescript
  {routeChangeProps && (
    <Form.Text
      onClick={() => navigate('/register')}
      className="text-muted"
    >
      Register
    </Form.Text>
  )}
  ```

#### Unused routes() function

- Routing is now handled by `react-router-dom`, I have decided to go with Claude's recommendation of an inline expression so that I can use the `useNavigate` hook (which can only be used inside of a function component).

  ```typescript
  {registerLink && (
    <Form.Text onClick={() => navigate('/register')} className="text-muted">
      Register
    </Form.Text>
  )}
  ```

#### `useNavigate` instance now exists within Signin

- Since **Signing** is the only component that requires the link, it makes sense to keep the check inside Userform but instantiate `useNavigate` inside of Signin, where it's used:

  ```typescript
  {registerLink && (
    <Form.Text onClick={onRegisterClick} className="text-muted">
      Register
    </Form.Text>
  )}
  ```

  In Userform.tsx:

  ```typescript
  onClick={onSubmitFunction}
  ```

### Key Learning

-

### Open Questions

- 


## Register.tsx - [Mar 16 - 17, 2026]

### Problems Found

#### Userform Import Error

- The following import statement was not picking up the function exported from Userform.tsx, and re-exported via a barrel file.

  ```javascript
  import { Userform } from '../Userform';
  ```

 In index.js (adjacent to Userform.tsx, in /src/Userform):

  ```javascript
  import Userform from './Userform';

  export {Userform};
  ```
  
  Here's the error back in Register.tsx:

  ```console
  Could not find a declaration file for module '../Userform'. '/Users/stephenpritchard/Developer/Projects/conjugation-refactor/conjugation_frontend/src/components/Userform/index.js' implicitly has an 'any' type.
  ```

#### `onChange` property type

- Having already defined the type of the `formGroup` object in *Userform.tsx* as `FormGroupType`, there is now a type error stemming from the assignment of the `handleInputChange` method to the `onChange` property. Here's an example in *Register.tsx*:

  ```typescript
  {
    controlId: 'formBasicName',
    type: 'text',
    placeholder: 'Enter name',
    onChange: handleInputChange('name'),
    value: formInputData.name,
  }
  ```

  For reference, here's the definition of `FormGroupType`:

  ```typescript
  type FormGroupType = {
    controlId: 'formBasicName' | 'formBasicEmail' | 'formBasicPassword';
    type: 'text' | 'email' | 'password';
    placeholder: string;
    onChange: () => (event: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
  };
  ```

  As mentioned in my note from 12 March, my attempt to assign `(fieldName: string) => void` also caused an error because TypeScript expected `onChange` to have a type analagous to `ChangeEventHandler<FormControlElement>` due to the `FormControlProps.onChange` from the FormGroup type definition file.

### Research

#### `onChange` property type

- There is an [article](https://www.xjavascript.com/blog/typescript-input-onchange-event-type/) that demonstrates the use of an arrow function (which accepts the 'extra' argument) that returns another arrow function (which receives the event object). This pattern allows the type definition of a change handler function that receives an argument.
While I am able to successfully use this pattern to give a more specific type to `handleInputChange` in `authContext`:

  ```typescript
  type AuthContextType = {
    // ...
    handleInputChange: (
      fieldName: string
    ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
    // ...
  }
  ```

...I must still adjust the current type set to `onChange` in `FormGroupType`.

### Solution

#### Change barrel file extension from .js to .ts

- simply changing the barrel file to a typescript file allows the type information to be preserved (via the barrel file) and read where it is imported in Register.tsx

#### `onChange` property type

This problem was actually a combination of two issues (one that I was focused on, another that I missed):

 1. `(event: React.ChangeEvent<HTMLInputElement>) => void` is the type that conforms to the expected `React.ChangeEventHandler<FormControlElement>;` type for `Form.Control.onChange`. This the type that matches the value that I had assigned - as props from Register.tsx` - to Userform's formGroup[]'s onChange property.
 I thought that `handleInputChange('name')` was an assignment of the function reference but I was actually assigning the return value - which is `(event: React.ChangeEvent<HTMLInputElement>) => void` so I was close! More on this in 'Key Learning' below.

 2. The other issue was that I had not made Userform's `registerLink` and `onRegisterClick` props optional, and that this was highlighted in a separate error message that I did not read properly and *assumed* that it was related to the above issue.

### Key Learning

**Function Calls vs References in TypeScript:**

When assigning a function's return value (not the function itself), the type is the return type, not the function type.
```typescript
// Function reference (not called)
const ref = handleInputChange;
// Type: (fieldName: string) => (event: ...) => void

// Function return value (called)
const val = handleInputChange('name');
// Type: (event: ...) => void
```

**Applied to curried event handlers:**
```typescript
// In object
onChange: handleInputChange('name')
//        ^^^^^^^^^^^^^^^^^^^^^^^^^ Calling it
//        Type: what it RETURNS (inner function)

// So FormGroupType.onChange should match the inner function type
onChange: (event: React.ChangeEvent) => void
```

**Error Message Priority:**
When TypeScript shows multiple errors, fix the simple/obvious ones first (missing props) before diving into complex ones (type mismatches). Sometimes the simple fix resolves or clarifies the complex issue.

### Open Questions

- 

## Practise.tsx - [Mar 18, 2026]

### Problems Found

#### Union Types Don't Auto-Narrow

FormControlElement is a union (HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement), but function expects specific type.

**Why TypeScript doesn't allow:**

```typescript
// onChange gives: ChangeEvent
onChange={(e) => setQuestions(e)}

// But setQuestions expects: ChangeEvent
function setQuestions(e: ChangeEvent) { }
```

### Research

### Solution

#### Union Types Don't Auto-Narrow

```typescript
onChange={(e: ChangeEvent) => setQuestions(e)}
//         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Narrow the union
```

**This is safe when:**
- You know the specific type (e.g., `type="range"` makes it an input)
- React Bootstrap's union is overly broad for your use case

**Key Concept:**
Union types are permissive on input (accept any member) but strict on usage (must narrow before accessing type-specific properties).

### Key Learning

### Open Questions

- 

## App.tsx - [Mar 20, 2026]

### Problems Found

1. **never[] inference for favourites array**
   TypeScript inferred empty array as `never[]` instead of `string[]`

2. **User.id type inconsistency**
   - API returns id as string (JSON serialization)
   - Components expect id as number
   - Needed to convert at every usage point

### Research

- Reviewed [article](https://dbiswas.com/blog/typescript-never-array/) on never[] inference (article first referenced in `auth-context` conversion) 
- Identified conversion should happen at API boundary, not at every usage

### Solution

1. **favourites type assertion:**
```typescript
   favourites: [] as string[]
```

2. **User.id conversion at boundary:**
   - Changed User type: `id: number` (semantic type)
   - Convert once in loadUser: `id: parseInt(user.id, 10)`
   - Updated initialUserState: `id: 0`
   - Components now receive correct type without conversion

### Key Learning

**Data transformation belongs at boundaries:**
- Convert API types to app types when data enters system
- Don't scatter conversions throughout codebase
- Type system should represent semantic meaning, not wire format

### Open Questions

- 

## auth-context.tsx - [Apr 09, 2026]

### Problems Found

1. **duplicated body initialization**
   `body` is initialised and constructed with the `field` array property's .`reduce()` method, and then again with the `forEach()` method on the same array:

   ```typescript
   const body = config.fields.reduce(
      (acc, field) => {
        acc[field] = formInputData[field];
        return acc;
      },
      {} as Record<string, string>,
    );

   config.fields.forEach((field) => {
      body[field] = formInputData[field];
    });
   ```

2. **`Record<string, string>` for `body` is a loose type**
   The type assigned to `body` allows for any string to be set as a key on the object, yet we know from the `config` variable declared in the `submitForm` function body that type of the key is union of `'name' | 'email' | 'password'`.

### Research

- In my first attempt to create a more robust type:

  ```typescript
  {
    [key: 'name' | 'email' | 'password']: string
  }
  ```

  Resulted the following error: `An index signature parameter type cannot be a literal type or generic type. Consider using a mapped object type instead`
  After looking up [Mapped Types in the official documentation](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html) I attempted a different approach; `{} as AuthConfigFields<typeof config.fields>` where `AuthConfigFields` is defined as a mapped type:

  ```typescript
  type AuthConfigFields<Type> = {
    [Property in keyof Type]: string;
  };  
  ```

  However, this also failed because `typeof config.fields` is a tuple, and its keys are a sequence of 0-index integers (like an array), whereas the keys of body must be strings, hence a type mismatch at `acc[field] = formInputData[field];`

### Solution

1. **duplicated body initialization**
  Simply remove the second initialisation.
  The type was changed to replace the type of the keys with a static union:

  ```typescript
  const body = config.fields.reduce(
      (acc, field) => {
        acc[field] = formInputData[field];
        return acc;
      },
      {} as Record<'name' | 'email' | 'password', string>,
    );
  ```

2. **loose type for keys of `body`**
  Use the `typeof` keyword to extract the tuple that is the type of the `config.fields` property. `[number]` says "give me the type you'd get if you indexed this tuple with any valid numeric index" — and since any element could be at a numeric position, you get the full union. So for readonly ['name', 'email', 'password'] it gives 'name' | 'email' | 'password'. 

  ```typescript
  const body = config.fields.reduce(
    (acc, field) => {
      acc[field] = formInputData[field];
      return acc;
    },
    {} as Record<(typeof config.fields)[number], string>,
  );
  ```

  One thing worth noting: because formType is 'register' | 'signin', TypeScript sees config.fields as potentially either tuple — so the union covers both, giving you 'name' | 'email' | 'password' in all cases. Signin technically allows a name key in the type. That's a known, acceptable limitation given this is an internal detail.
   

### Key Learning

- Index signatures cannot use literal types. [key: 'name' | 'email'] is invalid. When you need an object type with specific known keys, use Record<K, V> or a mapped type instead.

- Record<K, V> is a mapped type. It's not special syntax — it's shorthand for { [P in K]: V }. Understanding this means you can use Record with any valid key type, including unions.

- keyof on a tuple gives indices, not values. keyof readonly ['name', 'email', 'password'] gives 0 | 1 | 2 | 'length' | 'map' | ... — the keys of the tuple as a data structure, not the string values stored in it.

- T[number] extracts a union of element types from a tuple or array. This is an indexed access type — the type-level equivalent of bracket notation. It says "what type would I get if I indexed this with any number?" — giving you the full union of element types.

- Types describe shapes at compile time; they don't track runtime execution. reduce runs at runtime, field by field. TypeScript doesn't follow that — it just checks that the types are compatible up front.

### Open Questions

- does `(typeof config.fields)[number]` stay correctly narrowed per formType (register vs signin), or does it always widen to the full union?