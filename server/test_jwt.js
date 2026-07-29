import jwt from 'jsonwebtoken';

const token = jwt.sign({ id: '123', type: 'access' }, 'secret', {
  expiresIn: '36500d',
});

const decoded = jwt.verify(token, 'secret');
console.log(decoded);
