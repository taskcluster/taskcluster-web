Standard sizes:

```js
['error', 'success', 'warning', 'default', 'info'].map(label => (
  <span>
    <Label status={label}>{label}</Label>{' '}
  </span>
))
```

Mini:

```js
['error', 'success', 'warning', 'default', 'info'].map(label => (
  <span>
    <Label mini status={label}>{label}</Label>{' '}
  </span>
))
```
