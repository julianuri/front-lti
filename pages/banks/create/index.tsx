import BankCreationForm from '../../../src/components/Banks/BankCreationForm/BankCreationForm';
import { useRouter } from 'next/router';

const CreateBankPage = function() {
  const {bankId, bankName} = useRouter().query;

  return <BankCreationForm bankId={bankId} bankName={bankName}/>;
};

export default CreateBankPage;
