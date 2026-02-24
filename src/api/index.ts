// Export API client and related functions
export { SiYuanClient } from './client';
export { listNotebooks } from './notebook';
export { createNotebook } from './notebook';
export { deleteNotebook } from './notebook';
export { renameNotebook } from './notebook';
export { openNotebook } from './notebook';
export { closeNotebook } from './notebook';
export { getNotebookConfig } from './notebook';

export { createDoc } from './document';
export { deleteDoc } from './document';
export { deleteDocByID } from './document';
export { renameDoc } from './document';
export { renameDocByID } from './document';
export { moveDocs } from './document';
export { moveDocsByID } from './document';
export { exportDoc } from './document';
export { getHPathByPath } from './document';
export { getHPathByID } from './document';
export { getIDsByHPath } from './document';

export { getBlockKramdown } from './block';
export { updateBlock } from './block';
export { deleteBlock } from './block';
export { insertBlock } from './block';
export { prependBlock } from './block';
export { appendBlock } from './block';
export { moveBlock } from './block';
export { getChildBlocks } from './block';
export { foldBlock } from './block';
export { unfoldBlock } from './block';

export { executeQuery } from './search';
