# pdf-to-gif

Generate GIF from PDF files, easy. Inspired from [freeman's pdf-to-png package](https://github.com/freeman-lab/pdf-to-png)

Freeman's package does not capture all of pages but we need, then I did.

**This package depends on imagemagick for generating GIF.**

## Programmatic Usage

```javascript
require('pdf-to-gif')({
  input: 'assets/demo.pdf',
  output: 'demo',
  scale: 1,
  delay: 100,
  loop: 1
})
```

*Enjoy.* :+1:

![gif](assets/enjoy.gif)
