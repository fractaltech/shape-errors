# shape-errors
### We follow [breaking].[feature].[fix] versioning.

```js
const shape = require('shape-erros');
const s = shape({
  user_id: (userId) => userExists(userId).then((result) => result ? null : 'invalid user'),
  name: (name, {user_id}) => findUserByName(name).then((user) => user.id === user_id ? null : 'invalid name')
})

s.errors(data).then((errors) => {})
```
