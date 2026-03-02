# Conversion Progress

- [x] auth-context.tsx - First pass complete
  - [ ] Refactor body building (remove unnecessary initialization)
  - [ ] Add validation helper function (email/password format)
  - [ ] Ensure validation exists server-side (check backend routes)
- [x] conjugation-context.tsx
  - [ ] Investigate timing dependency in searchVerbs - why does awaiting listFavourites cause sticky searches?
  - [ ] Consider refactoring searchVerbs to be properly async
- [x] quiz-reducer.jsx
- [ ] Conjugation.jsx
- [ ] Header.js
- [ ] Question.jsx
- [ ] Register.jsx / Signin.jsx / Userform.jsx
- [ ] VerbTable.jsx
- [ ] RootLayout.jsx
- [ ] Reference.jsx
- [ ] Practise.jsx

# Outstanding TODOs

## auth-context.tsx
- [ ] Create proper `User` type instead of `{}`
- [ ] Review whether `Record<string, string>` for `body` is appropriate
- [ ] Apply User type consistently once created

## conjugation-context.tsx
- [ ] ...


# TypeScript Conversion Notes

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
Then assin a union of those 2 types to `body`:

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