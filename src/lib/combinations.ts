export function* combinations<T>(
  items: Iterable<T>,
  r: number,
): Generator<T[]> {
  // Collect into array once to allow index-based generation
  const pool = Array.from(items);
  const n = pool.length;

  if (r < 0 || r > n) {
    return; // no combinations
  }
  if (r === 0) {
    // yield empty combination
    yield [];
    return;
  }

  // Initial index tuple [0, 1, ..., r-1]
  const indices = Array.from({ length: r }, (_, i) => i);

  // Helper to materialize current combination from indices
  const materialize = (): T[] => indices.map((i) => pool[i]);

  // Emit the first combination
  yield materialize();

  // Generate subsequent combinations by advancing indices
  while (true) {
    let i = r - 1;

    // Find rightmost index that can be incremented
    while (i >= 0 && indices[i] === i + n - r) {
      i--;
    }
    if (i < 0) {
      // All combinations have been generated
      return;
    }

    // Increment this index
    indices[i]++;

    // Reset the following indices to maintain increasing order
    for (let j = i + 1; j < r; j++) {
      indices[j] = indices[j - 1] + 1;
    }

    yield materialize();
  }
}
