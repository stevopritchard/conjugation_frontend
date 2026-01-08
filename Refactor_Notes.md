# Refactoring Notes

## Userform Component - [Oct 4, 2025]

### Problems Found

- No input validation
- Email prop is misspelled in one place (line 23)
- handleSubmit doesn't check for empty fields

### Questions

- Should password validation be here or on backend?
- Does Register component pass different props than SignIn?

### Decisions

- Using controlled inputs (useState per field)
- Validation on blur, not on every keystroke
- Error messages inline below each field

### Blockers

- None yet

### Notes

- The onEmailChange prop name is confusing - it's actually just onChange
- Parent component will need updating for new prop interface

# Refactoring Notes - Recovered

## Userform Component - handling validation with onBlur - [Oct 7, 2025]

### Problems Found

- Validation state is not modified on user input
- Email prop is misspelled in one place (line 23)
- handleSubmit doesn’t check for empty fields

### Questions

- Should password validation be here or on backend?
- Does Register component pass different props than SignIn?

### Decisions

- Add `onBlur` handlers to inputs that run validation functions
- Validation on blur, not on every keystroke
- Error messages inline below each field

### Blockers

- Must edit the parents because the input values are available in state and can be received by Userform component as props

### Notes

- extracted type-selection expression into a function to reduce repetition: `formGroup[i].type === 'text' ? 'name' : formGroup[i].type`
- input value state is managed in parent by onChange handler; value is passed back to Userform for validation
- validation functions are now methods on the `validators` object
- the handler function (which contains its state updating expression) is declared inside the component body; it must have access to component state

## Userform Component - Disable submit button based on error state - [Oct 7, 2025]

### Problems Found

- Validation state includes a ‘name’ property which cannot be updated by SignIn component
- Submit button is not disabled while input values are incomplete or invalid
- Password input’s error message stretches the wrapping Form element’s width

### Questions

- Should Register parent component’s onSubmit handler handle whether or not the child Userform component displays `'Please fill in all fields'` if any of the inputs are empty on submission? Likely best place for this is in authContext created in a future update.

### Decisions

- declared `isReadyToSubmit` state, but cannot update it on the same re-render as `errorMessages` and therefore cannot deactivate the submit button’s `disabled` in step with the completion of the input fields
- have used an inline expression until I can figure out how to abstract it
  - the problem was that expression relies on state update (not available until the next re-render); solved by passing the expression to `useEffect`

### Blockers

- none

### Notes

- have used an inline expression to configure the `disabled` prop until I can figure out how to abstract it into `setIsReadyToSubmit` **SOLVED** see Decisions, above
- added missing `controlId: 'formBasicName'` key-value pair to prop passed for name input from Reference.jsx. This was used to determine props to assign to `errorMessages` state object
- should pass this value to `chooseInputType` instead of the form type

## Userform Component - Register state consolidation - [Oct 8, 2025]

### Problems Found

- After changing the onChange handler functions so that they update a consolidated state object instead of a single value, when a value is keyed into the input, the following error thrown:

  ```
  This synthetic event is reused for performance reasons. If you're seeing this, you're accessing the property `target` on a released/nullified synthetic event. This is set to null. If you must keep the original synthetic event around, use event.persist().
  ```

### Questions

- Why are synthetic event only a problem now? I have not changed the two-way binding implementation.
- it appears that because I’m executing the state update inside a closure, that the event value is not available to update to the state object and is _nullified_.

### Decisions

- I have added `event.persist()` to each function call for the time being.
- after further reading, I’ve decided assign the event value to a variable by destructuring the event object. It better approach, as I’m not using a deprecated method in my code.
- I have decided to keep `responseText` as a separate state variable, despite being passed to the same destination as props to Userform; the reason being that its purpose, though related, is different in that it is not related to the request sent to the database.

### Blockers

- none

### Notes

- This issue occurred because I’m currently using React version 16. From v.17 onwards, events are not wrapped in a Synthetic Event.

## Userform Component - Register onChange handler consolidation - [Oct 11, 2025]

### Problems Found

- The unified `onChange` handler needs to be able to update the correct property on the `formInputData` state object. However, a function cannot accept the `event` object automatically along with another argument.

### Questions

- What pattern could be applied to give the onChange handler access to both the event object and the type of input?

### Decisions

- At Claude’s suggestion, I decided to use a closure pattern to make the type available to the onChange handler function:

  ```javascript
  function handleInputChange(fieldName) {
    return function (event) {
      const { value } = event.target;
      setFormInputData((prevState) => ({
        ...prevState,
        [fieldName]: value,
      }));
    };
  }
  ```

- the input type will be set in the parent, with the onChange function as it’s passed with the `formGroup` props. Example:

  ```javascript
  {
    controlId: 'formBasicPassword',
    type: 'password',
    placeholder: 'Password',
    onChange: handleInputChange('password'),
    value: formInputData.password,
  }
  ```

### Blockers

- none

### Notes

- none

## Userform Component - AuthContext - [Oct 15, 2025]

### Problems Found

- `loadUser` and `routeChange` functions are called by onSubmit and therefore need to be made available to `AuthContextProvider`

### Questions

- none

### Decisions

- I bundled the migration of state and the `handleInputChange` into a single commit, because as I was migrating the state I realised that it would be more straightforward to move that function which updates those state objects.
- For the sake of keeping the scope of changes solely away from App.js for this commit, I have passed `loadUser` and `routeChange` functions as arguments.
  - `routeChange` will likely be directly affected by subsequent work in the implementation of the `react-router` library, and will be addressed in those commits.
  - while `loadUser` modifies the `user` state object, and receives its values from the object returned by the fetch request in `AuthContext`, the declaration exists in the root App.js component and its values are passed to Reference.js, a container component that is outside of the scope of this commit. Therefore I have also decided to handle it as an argument, rather than move the declaration into this context instance.

### Blockers

- none

### Notes

- none

## Userform Component - React Router - [Oct 20-22, 2025]

### Problems Found

1. the current version of React Router is incompatible with the version of React that I am currently using in my project (v16.13.0)
1. replacing part the stateful routing (using the `mode` variable) while leaving the remaining `route` routing intact _and_ simultaneously establishing a `createBrowserRouter` instance to handle routing leads to issues where authentication components are re-executed due to state updates, throwing the user out of the app and back to the sign-in component/page.

### Questions

- none

### Decisions

_In order of the problems listed above in Problems Found_

1. instead of upgrading the version of React in my project (will likely cause dependency issues that I will have to divert attention to), I will instead install a legacy version of React Router and use APIs from that version.

- installed version 5.3.4, then noticed from looking at the documentation that the legacy library lacks APIs that I would likely need
- instead have decided to **upgrade my core React dependencies**

1. with some assistance from Claude, re-organised by task list:

- established a `router` object that manages container and authentication components, using the existence of a `user` to evaluate if the user is signed in, and using React Router’s <Navigate /> component to throw the user back to the sign-in component if not.
- removed all `route` state checks from App.js and `onRouteChange` props from authentication components and context
- replaced `routeChange` calls with `useNavigate` hook.

### Blockers

- none

### Notes

- I had to declare the `useNavigate` hook inside Signin and Registration separately because neither App.js nor <AuthContextProvider /> are in the context of the <Router> component. A minor duplication of code, but a concession required to get the routing working properly.

## Userform Component - React Router - [Oct 23, 2025]

### Problems Found

- The <Header> component exists outside of the <Router> context, meaning that it cannot use the <NavLink> component

### Questions

- none

### Decisions

- Wrapped all rendered elements in a <RootLayout> container, including <Header>, so that every child has access to the router context

### Blockers

- none

### Notes

- none

## Reference Component - [Nov 19, 2025]

### Problems Found

- When the user 'unfavourites' a verb (in VerbCard), `favourites` props are not updated and therefore the list of 'favourites' is not updated

### Questions

- The `favourites` prop is set by `submitForm` in authContext. Rather than call this function again (and update the `user` in its entirety while logged in), I need to find the most appropriate way to query the user's 'favourites' in the database to update this prop. I do not think that `authContext` is the appropraite place for this, so this might be better placed in `conjugationContext` (or whatever name I choose).

### Decisions

-

### Blockers

-

### Notes

-

## Reference Component - [Nov 20, 2025]

### Problems Found

-

### Questions

- .

### Decisions

- Continuing from yesterday, instead of setting the user's favourites on the object set by signin/registration, it should instead be a state array by set directly in the reference element by passing the user's `id` (already receieved) to the `/check_favourites` endpoint and replacing the set value of `favourites`, which would cause the app to re-execute and update the list.

### Blockers

-

### Notes

-

## Reference Component - [Nov 25, 2025]

### Problems Found

- `listFavourites` does not actually check the user's favourites list; it is instead checked once when the user logs in and the `user` object is updated in App.js.
- in assigning conjugation state, 19 different API calls are made

**Problems idenitfied by Claude**

- `useEffect` logic creates a potential infinite loop.
- `addFavourites` and `removeFavourites` do not update state, which necessitates the update of state in the aforementioned `useEffect` call.
- an expansive number of conjugation props are passed to the Conjugation component

### Questions

-

### Decisions

- `listFavourites` now chains fetch requests, creating an array with the response from the `check_favourites` endpoint and using that to create a list of infinitives filtered from the database using that list.
- I will address the excess number of API calls in another feature branch; solving this problem requires consolidation of endpoints in the backend, and is outside the scope of this feature change.
- useEffect only runs on component mounts, and simply runs `listFavourites`
- `addFavourites` and `removeFavourites` now call `listFavourites` to keep the favourites list up to date with user additions or removals

### Blockers

-

### Notes

-

## Reference: Router Loader - [Nov 27, 2025]

### Problems Found

- Though `listFavourites` uses the `fetch` API to make requests to the server, it is also a state-updating function. Therefore replacing `useEffect` with loader would require that some of the logic in `listFavourites` be split out, as the loader cannot access state directly.
- The loader cannot access context, requiring that either the loader has a more limited function and passes data into context, or that logic context is moved into the loader

-

### Questions

-

### Decisions

- Keeping `listFavourites` in context makes sense. The architectural changes required to incoporate a loader for the purposes of setting favourites invite scope creep.
- I have also decided not to proceed with using a loader in the Conjugation component. As with `listFavourites`, state will need to be modified, requiring that logic be split out.

### Blockers

-

### Notes

-

## Question component - [Jan 08, 2026]

### Problems Found

- Issues raised by Claude on code review:

  1. DOM queries run on every render - document.getElementsByTagName('input') happens repeatedly
  2. Variables recalculate on every render - randNum, correctForm etc. should be useState or useMemo
  3. answer variable gets reset - it’s not in state, so it resets to 0 on every render

-

### Questions

-

### Decisions

- went with a 'controlled component' pattern:
  - introduced state to **keep dynamic values persistent**:
    - converted `correctForm` and `correctPronoun` to state variables
    - created the `selectedForm` state variable to replace `checked`
  - introduced useEffect to **keep dynamic values aligned to component updates**:
    - `randNum` is moved into useEffect's callback argument, so it’s only calculated when conjugation changes (new question), not on every re-render
    - `correctForm` and `correctPronoun` are also assigned their values in this function, so that all values are controlled at the same lifecycle stages and events
  - memoized `forms`; though the array items will not change until a new question is generated, they are reference values and the reference itself will not persist on re-renders of the component

### Blockers

-

### Notes

- These changes were done at the suggestion of Claude, and after Claude reviewed my code (largely untouched in the refactor)
