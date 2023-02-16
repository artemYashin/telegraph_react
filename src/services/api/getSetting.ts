const getSetting = async (name: string) => ((await fetch(`http://localhost:3000/api/settings/${name}`)).json());
export default getSetting;
