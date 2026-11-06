import { readJSON, writeJSON } from '../utils/storage';

const OBJECTS_KEY = 'app_objects';

export interface ConstructionObject {
  id: number;
  name: string;
  address: string;
}

const MOCK_OBJECTS: ConstructionObject[] = [
  { id: 1, name: 'Фундамент', address: 'ул. Строителей, д. 1' },
  { id: 2, name: 'Опалубка', address: 'ул. Строителей, д. 2' },
  { id: 3, name: 'Канализация', address: 'ул. Гагарина, д. 10' },
];

export function loadObjects(): ConstructionObject[] {
  const stored = readJSON<ConstructionObject[]>(OBJECTS_KEY, []);
  if (stored.length > 0) {
    return stored;
  }
  writeJSON(OBJECTS_KEY, MOCK_OBJECTS);
  return MOCK_OBJECTS;
}

export function saveObjects(objects: ConstructionObject[]): void {
  writeJSON(OBJECTS_KEY, objects);
}
