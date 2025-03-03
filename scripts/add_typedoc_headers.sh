find docs -type f -name "*.js" -exec sed -i '' '1i\
/**\
 * @license\
 * Copyright 2025 Google LLC\
 * SPDX-License-Identifier: Apache-2.0\
 */\
\
' {} \;
