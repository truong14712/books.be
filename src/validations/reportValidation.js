import validateRequest from '~/middlewares/validateRequest.js';
import ReportSchema from '~/schemas/reportSchema';

const { report } = ReportSchema;

const ReportValidation = {
  report: validateRequest(report),
};
export default ReportValidation;
