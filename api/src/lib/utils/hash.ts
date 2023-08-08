import bcrypt from 'bcrypt';

export function getHash(value: string, salt?: string | number) {
	if(!salt){
		salt = 10;
	}
	const hashedPassword = bcrypt.hashSync(value, salt);
	return hashedPassword; 
}