// UTILITY FUNCTIONS

export function NOTE(...args) {
  args.splice(0, 0, 'NOTE:')
  console.log.apply(this, args)
}
