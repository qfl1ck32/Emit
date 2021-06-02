import { createError } from 'apollo-errors'

export const SomethingWrongHappened = createError('SomethingWrongHappened', {
    message: 'Something wrong happened. Please try again.'
})
