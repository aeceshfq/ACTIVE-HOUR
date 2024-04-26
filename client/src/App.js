//   SSS  H   H  AAAAA  FFFFF  III  QQQ
//  S     H   H  A   A  F       I   Q   Q
//   SSS  HHHHH  AAAAA  FFFF    I   Q   Q
//      S H   H  A   A  F       I   Q  QQ
//   SSS  H   H  A   A  F      III   QQQ

import AppProvider from "./providers/AppProvider";
import AuthProvider from "./providers/AuthProvider";

function App() {
	return (
		<AppProvider>
			<AuthProvider />
		</AppProvider>
	);
}

export default App;
