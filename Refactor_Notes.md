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