import { Movement } from '../../types';

interface MovementActionsProps {
  movement: Movement;
}

export default function MovementActions({ movement }: MovementActionsProps) {
  // No actions available since movements cannot be deleted
  return null;
}