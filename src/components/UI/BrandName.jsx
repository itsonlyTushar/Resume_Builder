/**
 * BrandName component - renders "xLPA" with a cursive "x" using Dancing Script font.
 * Use this component everywhere the brand name appears in JSX.
 */
function BrandName() {
  return (
    <>
      <span style={{ fontFamily: "'Dancing Script', cursive", fontWeight: 700 }}>x</span><span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800 }}>LPA</span>
    </>
  );
}

export default BrandName;
