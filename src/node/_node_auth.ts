/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Auth} from 'google_genai/google/genai/src/_auth'

export class NodeAuth implements Auth {
    addAuthHeaders(headers: Headers): Promise<void> {
        throw new Error('Method not implemented.');
    }

}