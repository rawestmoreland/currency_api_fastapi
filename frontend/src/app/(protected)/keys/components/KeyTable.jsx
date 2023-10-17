import PropTypes from 'prop-types'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'

KeyTable.propTypes = {
  keys: PropTypes.arrayOf(PropTypes.shape({})),
}

export default function KeyTable({ keys }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead>Key</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Deactivate</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {keys.map(key => (
          <TableRow key={`api-key-${key.id}`}>
            <TableCell className="font-medium">{key.name}</TableCell>
            <TableCell>{key.obfuscated_key}</TableCell>
            <TableCell>
              {format(new Date(key.created_at), 'yyyy-MM-dd')}
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="destructive"
                size="icon"
                onClick={() => console.log('delete')}
              >
                <XMarkIcon height={24} width={24} />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
