<script>
//   import '../app.css';          // global styles (optional)
</script>

<aside>
  <nav>
    <a href="/docs">Intro</a>
    <a href="/docs/forms">Forms</a>
    <a href="/docs/api/check">API</a>
    <a href="/docs/guides">Guides</a>
    <a href="/docs/faq">FAQ</a>
  </nav>
</aside>

<main>
  <slot />
</main>

<style>
  aside  { width: 12rem; background:#f3f4f6; padding:1rem; }
  main   { flex:1; padding:2rem; }
</style>