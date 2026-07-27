import { cn } from '../../utils/cn';

/**
 * Minimal compound table: <Table><Table.Head/><Table.Body>...</Table.Body></Table>
 * Handles horizontal scroll on small screens automatically.
 */
const Table = ({ className, children }) => (
  <div className="overflow-x-auto rounded-xl border border-mist">
    <table className={cn('w-full min-w-[640px] text-left text-sm', className)}>{children}</table>
  </div>
);

const TableHead = ({ children }) => (
  <thead className="border-b border-mist bg-cloud">
    <tr>{children}</tr>
  </thead>
);

const TableHeaderCell = ({ className, children }) => (
  <th className={cn('px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500', className)}>
    {children}
  </th>
);

const TableBody = ({ children }) => <tbody className="divide-y divide-mist bg-white">{children}</tbody>;

const TableRow = ({ className, children, ...rest }) => (
  <tr className={cn('transition-colors hover:bg-cloud/60', className)} {...rest}>
    {children}
  </tr>
);

const TableCell = ({ className, children, ...rest }) => (
  <td className={cn('px-4 py-3.5 align-middle text-slate-600', className)} {...rest}>
    {children}
  </td>
);

Table.Head = TableHead;
Table.HeaderCell = TableHeaderCell;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Cell = TableCell;

export default Table;
