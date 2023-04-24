# Diff Details

Date : 2023-03-30 11:31:36

Directory c:\\Dev\\Koulu\\ConsoleCarrier\\Console-Carrier\\backend

Total : 44 files,  -786 codes, 72 comments, -64 blanks, all -778 lines

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [backend/airplane.py](/backend/airplane.py) | Python | 29 | 9 | 5 | 43 |
| [backend/carrier_handler.py](/backend/carrier_handler.py) | Python | 44 | 6 | 8 | 58 |
| [backend/config.py](/backend/config.py) | Python | 71 | 2 | 7 | 80 |
| [backend/db_handler.py](/backend/db_handler.py) | Python | 109 | 14 | 30 | 153 |
| [backend/gui_handler.py](/backend/gui_handler.py) | Python | 132 | 6 | 15 | 153 |
| [backend/main.py](/backend/main.py) | Python | 51 | 30 | 13 | 94 |
| [backend/observer.py](/backend/observer.py) | Python | 20 | 4 | 3 | 27 |
| [backend/route_handler.py](/backend/route_handler.py) | Python | 105 | 13 | 16 | 134 |
| [backend/routes.py](/backend/routes.py) | Python | 168 | 6 | 21 | 195 |
| [frontend/src/App.css](/frontend/src/App.css) | CSS | -4 | 0 | -1 | -5 |
| [frontend/src/Login.tsx](/frontend/src/Login.tsx) | TypeScript JSX | -49 | 0 | -7 | -56 |
| [frontend/src/Map/Airport.ts](/frontend/src/Map/Airport.ts) | TypeScript | -43 | 0 | -2 | -45 |
| [frontend/src/Map/Map.css](/frontend/src/Map/Map.css) | CSS | -39 | 0 | -3 | -42 |
| [frontend/src/Map/Map.tsx](/frontend/src/Map/Map.tsx) | TypeScript JSX | -196 | -8 | -22 | -226 |
| [frontend/src/Map/TrackingMarker.tsx](/frontend/src/Map/TrackingMarker.tsx) | TypeScript JSX | -73 | -2 | -12 | -87 |
| [frontend/src/Map/api.ts](/frontend/src/Map/api.ts) | TypeScript | -107 | -1 | -11 | -119 |
| [frontend/src/assets/message.tsx](/frontend/src/assets/message.tsx) | TypeScript JSX | -5 | 0 | -2 | -7 |
| [frontend/src/assets/react.svg](/frontend/src/assets/react.svg) | XML | -1 | 0 | 0 | -1 |
| [frontend/src/components/Alert/Alert.css](/frontend/src/components/Alert/Alert.css) | CSS | -20 | 0 | -3 | -23 |
| [frontend/src/components/Alert/Alert.tsx](/frontend/src/components/Alert/Alert.tsx) | TypeScript JSX | -33 | 0 | -9 | -42 |
| [frontend/src/components/Button/Button.module.css](/frontend/src/components/Button/Button.module.css) | CSS | -68 | 0 | -10 | -78 |
| [frontend/src/components/Button/Button.tsx](/frontend/src/components/Button/Button.tsx) | TypeScript JSX | -15 | 0 | -4 | -19 |
| [frontend/src/components/Input.tsx](/frontend/src/components/Input.tsx) | TypeScript JSX | -21 | 0 | -4 | -25 |
| [frontend/src/components/Like/Like.tsx](/frontend/src/components/Like/Like.tsx) | TypeScript JSX | -19 | 0 | -2 | -21 |
| [frontend/src/components/ListGroup.tsx](/frontend/src/components/ListGroup.tsx) | TypeScript JSX | -24 | 0 | -5 | -29 |
| [frontend/src/components/ListGroup/ListGroup.css](/frontend/src/components/ListGroup/ListGroup.css) | CSS | 0 | 0 | -1 | -1 |
| [frontend/src/components/ListGroup/ListGroup.tsx](/frontend/src/components/ListGroup/ListGroup.tsx) | TypeScript JSX | -36 | 0 | -7 | -43 |
| [frontend/src/components/ListGroup/index.ts](/frontend/src/components/ListGroup/index.ts) | TypeScript | -2 | 0 | -1 | -3 |
| [frontend/src/components/Modal/FuelView/FuelView.css](/frontend/src/components/Modal/FuelView/FuelView.css) | CSS | -18 | 0 | -4 | -22 |
| [frontend/src/components/Modal/FuelView/FuelView.tsx](/frontend/src/components/Modal/FuelView/FuelView.tsx) | TypeScript JSX | -63 | 0 | -7 | -70 |
| [frontend/src/components/Modal/Modal.css](/frontend/src/components/Modal/Modal.css) | CSS | -79 | 0 | -13 | -92 |
| [frontend/src/components/Modal/Modal.tsx](/frontend/src/components/Modal/Modal.tsx) | TypeScript JSX | -210 | 0 | -7 | -217 |
| [frontend/src/components/Modal/SearchBox.tsx](/frontend/src/components/Modal/SearchBox.tsx) | TypeScript JSX | -95 | 0 | -8 | -103 |
| [frontend/src/components/Modal/ShopView/ShopView.css](/frontend/src/components/Modal/ShopView/ShopView.css) | CSS | -6 | 0 | -1 | -7 |
| [frontend/src/components/Modal/ShopView/ShopView.tsx](/frontend/src/components/Modal/ShopView/ShopView.tsx) | TypeScript JSX | -65 | -1 | -7 | -73 |
| [frontend/src/components/NavBar/NavBar.css](/frontend/src/components/NavBar/NavBar.css) | CSS | -38 | 0 | -4 | -42 |
| [frontend/src/components/NavBar/NavBar.tsx](/frontend/src/components/NavBar/NavBar.tsx) | TypeScript JSX | -64 | -1 | -6 | -71 |
| [frontend/src/index.css](/frontend/src/index.css) | CSS | 0 | 0 | -1 | -1 |
| [frontend/src/main.tsx](/frontend/src/main.tsx) | TypeScript JSX | -27 | 0 | -6 | -33 |
| [frontend/src/types/Airplane.ts](/frontend/src/types/Airplane.ts) | TypeScript | -62 | -2 | -5 | -69 |
| [frontend/src/types/Carrier.ts](/frontend/src/types/Carrier.ts) | TypeScript | -19 | -2 | -3 | -24 |
| [frontend/src/types/leaflet-marker-easing.d.ts](/frontend/src/types/leaflet-marker-easing.d.ts) | TypeScript | -12 | 0 | -2 | -14 |
| [frontend/src/types/types.ts](/frontend/src/types/types.ts) | TypeScript | -2 | 0 | -1 | -3 |
| [frontend/src/vite-env.d.ts](/frontend/src/vite-env.d.ts) | TypeScript | 0 | -1 | -1 | -2 |

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details