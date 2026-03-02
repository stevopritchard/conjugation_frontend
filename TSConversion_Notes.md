# Conversion Progress

- [x] auth-context.tsx - First pass complete
- [ ] conjugation-context.tsx - In progress
- [ ] quiz-reducer.jsx
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
