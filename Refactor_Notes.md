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
