# AMR Approval and Capture

### TODO
- [x] Deleting records
- [x] Editing person values
- [x] Numbers only text fields
<<<<<<< HEAD
=======
- [x] Susceptibility colors based on result
- [ ] Modals
- [ ] Hashing patient registration number
>>>>>>> 79a99be17a8b604d8f73e57dd010b32c90d29fbe
- [x] Deselectable radio buttons
- [x] Disabling field after ASSIGN rule action
- [x] Storing incomplete records
- [x] Susceptibility colors based on result
- [ ] Modals
- [ ] Automatic possible duplation check
- [ ] Manual duplication confirmation
- [ ] Hashing patient registration number
- [ ] Using local storage for versioned meta data
- [ ] Special characters in test values
- [ ] Hide result section
- [ ] DD not have color when MIC has value
- [ ] Yellow and red DD/MIC colors more distinguishable
- [ ] Same sections on approval screen as on entry screen
- [ ] Person overview

### Installation

```
cd [root_dir]
yarn install
cd [root_dir]/approval
yarn install
cd [root_dir]/capture
yarn install
```

### Development

You need to log in to the test server:
`http://apps.hispindia.org/amr/`

```
cd [root_dir]
yarn start
cd [root_dir]/approval
yarn start
cd [root_dir]/capture
yarn start
```

### Building

```
cd [root_dir]
yarn build
```
