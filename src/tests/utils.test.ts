import { assertEquals } from "jsr:@std/assert";

import { extractUid, fileSizeOk, MAX_UPLOAD_SIZE } from "../utils.ts";

import {
  prepareVirtualFile,
} from "https://deno.land/x/mock_file@v1.1.2/mod.ts";

Deno.test({
  name: "Should return the uid",
  fn: () => {
    const uid = extractUid(
      "uid=100; expires=Mon, 18-Oct-2021 04:15:34 GMT; Max-Age=31536000; path=/",
    );
    assertEquals(uid, 100);
  },
});

Deno.test({
  name: "Should return 0 if no uid is found",
  fn: () => {
    const uid = extractUid(
      "expires=Mon, 18-Oct-2021 04:15:34 GMT; Max-Age=31536000; path=/",
    );
    assertEquals(uid, 0);
  },
});

Deno.test({
  name: "Should return 0 if cookie is empty",
  fn: () => {
    const uid = extractUid("");
    assertEquals(uid, 0);
  },
});

Deno.test({
  name: "Should return true if size is less than MAX_UPLOAD_SIZE",
  fn: () => {
    prepareVirtualFile("./file.srr", new Uint8Array(MAX_UPLOAD_SIZE), {
      size: MAX_UPLOAD_SIZE,
    });

    const fSizeOk = fileSizeOk("./file.srr");
    assertEquals(fSizeOk, true);
  },
});

Deno.test({
  name: "Should return false if size is larger than MAX_UPLOAD_SIZE",
  fn: () => {
    prepareVirtualFile("./file.srr", new Uint8Array(MAX_UPLOAD_SIZE + 1), {
      size: MAX_UPLOAD_SIZE + 1,
    });

    const fSizeOk = fileSizeOk("./file.srr");
    assertEquals(fSizeOk, false);
  },
});

Deno.test({
  name: "Should return false if size is much larger than MAX_UPLOAD_SIZE",
  fn: () => {
    prepareVirtualFile(
      "./file.srr",
      new Uint8Array(MAX_UPLOAD_SIZE + MAX_UPLOAD_SIZE),
      { size: MAX_UPLOAD_SIZE + MAX_UPLOAD_SIZE },
    );

    const fSizeOk = fileSizeOk("./file.srr");
    assertEquals(fSizeOk, false);
  },
});
