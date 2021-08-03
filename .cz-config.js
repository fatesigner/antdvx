module.exports = {
  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
  subjectLimit: 100,
  scopes: [],
  messages: {},
  types: [
    {
      value: 'feat',
      name: 'A new feature.'
    },
    {
      value: 'fix',
      name: 'A bug fix.'
    },
    {
      value: 'refactor',
      name: 'A code refactoring change.'
    },
    {
      value: 'style',
      name: 'Updating the UI and style files.'
    },
    {
      value: 'docs',
      name: 'Documentation change.'
    },
    {
      value: 'chore',
      name: 'A chore change.'
    },
    {
      value: 'impr',
      name: 'Improving performance.'
    },
    {
      value: 'assets',
      name: 'Adding or updating assets.'
    },
    {
      value: 'package',
      name: 'Updating compiled files or packages.'
    },
    {
      value: 'construction',
      name: 'Work in progress.'
    },
    {
      value: 'rewind',
      name: 'Reverting changes.'
    },
    {
      value: 'initial',
      name: 'Initial commit.'
    }
  ]
};
